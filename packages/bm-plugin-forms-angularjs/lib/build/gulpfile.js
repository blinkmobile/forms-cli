'use strict'

const path = require('path')
const fs = require('fs')

const kebabCase = require('lodash.kebabcase')
const gulp = require('gulp')
const babel = require('gulp-babel')
const embedTemplates = require('gulp-angular-embed-templates')
const concat = require('gulp-concat')
const header = require('gulp-header')
const footer = require('gulp-footer')
const ngAnnotate = require('gulp-ng-annotate')
const angularFilesort = require('gulp-angular-filesort')
const inject = require('gulp-inject')
const injectString = require('gulp-inject-string')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const through = require('through2')
const globby = require('globby')
const merge = require('merge-stream')

const findUp = require('find-up')

const toAngularName = require('../transform/to-angular-name.js')

const INDEX_HTML_PATH = process.env.indexHtmlPath
const FORM_BUNDLE_NAME = process.env.formBundleName
const VENDOR_BUNDLE_NAME = process.env.vendorBundleName

function makeModule (p, dest, pkgPath) {
  const fullPathToES2015Preset = require.resolve('babel-preset-es2015')

  return gulp.src(`${p}/**/**.js`)
    .pipe(babel({presets: [fullPathToES2015Preset]}))
    .pipe(angularFilesort())
    .pipe(embedTemplates())
    .pipe(ngAnnotate())
    .pipe(concat(`${path.basename(p)}.js`))
    .pipe(header(`(function (angular) {

`))
    .pipe(footer('\n})(window.angular);'))
    .pipe(gulp.dest(`${dest}/components`))
}

const dirs = (p) => fs.readdirSync(p).filter((f) => fs.statSync(`${p}/${f}`).isDirectory())

function blinkForms () {
  const dest = process.env.dest
  const src = process.env.src

  const pkgPath = findUp.sync('.blinkmrc.json')
  const streams = dirs(src).map((p) => makeModule(`${src}/${p}`, dest, pkgPath))

  return merge(...streams)
}

// unfortunately it seems many of these deps are not built to be bundled.
// come back to this later
function vendors () {
  const dest = process.env.dest
  const src = process.env.src

  // files that need to be bundled via browserify
  const moduleFiles = [
    `${src}/../node_modules/uuid/`,
    `${src}/../node_modules/@blinkmobile/angular-camera/`,
    `${src}/../node_modules/@blinkmobile/angular-location/lib/index.js`,
    `${src}/../node_modules/getusermedia/`,
    `${src}/../node_modules/signature_pad/`,
    `${src}/../node_modules/@blinkmobile/canvas-manipulation`,
    `${src}/../node_modules/@blinkmobile/angular-signature-pad`
  ]

  const b = browserify({
    entries: globby.sync(moduleFiles),
    debug: true
  })

  return b.bundle()
    .pipe(through())
    .pipe(source(VENDOR_BUNDLE_NAME))
    .pipe(buffer())
    .pipe(gulp.dest(dest))
}

// once we have made the component files, we need to run it through browserify to
// get any modules used by the components into one file.
function bundle () {
  const src = process.env.src
  const dest = process.env.dest

  // files that need to be bundled via browserify
  // these are files used in the angular source eg uuid generator
  const usedModules = [require.resolve('uuid')]
  const mods = [...usedModules, `${dest}/components/*.js`]

  const browserifyOptions = {
    basedir: __dirname,
    entries: globby.sync(mods),
    require: usedModules,
    paths: [
      path.resolve(__dirname),
      path.resolve(__dirname, '..'),
      path.resolve(__dirname, '..', '..',),
      path.resolve(__dirname, '..', '..', '..'),
      path.resolve(__dirname, '..', '..', '..', '..'),
      path.resolve(__dirname, '..', '..', 'node_modules')
    ],
    debug: true
  }

  // console.log('options', JSON.stringify(browserifyOptions, null, 2))

  const b = browserify(browserifyOptions)

  return b.bundle()
    .pipe(through())
    .pipe(source(FORM_BUNDLE_NAME))
    .pipe(buffer())
    .pipe(gulp.dest(dest))
}

// creates a sample HTML file to illustrate a basic way of including the
// components in a web page.
function createHTML (cb) {

  const src = process.env.src
  const dest = process.env.dest
  const templatePath = process.env.templatePath
  const pkgPath = findUp.sync('.blinkmrc.json')
  const angularForms = dirs(src)
    .map((f) => {
      const module = toAngularName(f)
      const component = kebabCase(f)
      return {
        module,
        component
      }
    })
  const angularModules = `'${angularForms.map((form) => form.module).join('\',\'')}'`
  const components = angularForms.reduce((str, form) => {
    str += `
    <${form.component} ng-if="$root.activeForm === '${form.module}'"></${form.component}>`
    return str
  }, '')

  return gulp.src(INDEX_HTML_PATH)
    .pipe(injectString.after('/* inject-string:angularjs-modules */', angularModules))
    .pipe(injectString.after('<body ng-init="$root.forms = ', `[${angularModules}]`))
    .pipe(injectString.after('<!-- inject-string:angularjs-components -->', components))
    .pipe(gulp.dest(dest))
}

// vendors task currently produces invalid output. the individual modules
// need to be fixed up so that we can enable bundling of our external modules
gulp.task('vendors', vendors)

// see https://medium.com/@dave_lunny/task-dependencies-in-gulp-b885c1ab48f0
// and https://github.com/gulpjs/gulp/issues/67
// for a good explaination on why you have to specify the
// dependencies on all gulp tasks
gulp.task('blinkForms', blinkForms)
gulp.task('bundle', ['blinkForms'], bundle)
gulp.task('build', ['bundle', 'blinkForms'], createHTML)

gulp.task('default', ['build'])
