'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const embedTemplates = require('gulp-angular-embed-templates')
const angularModule = require('gulp-angular-module')
const concat = require('gulp-concat')
const header = require('gulp-header')
const footer = require('gulp-footer')
const ngAnnotate = require('gulp-ng-annotate')
const angularFilesort = require('gulp-angular-filesort')
const inject = require('gulp-inject')
const jshint = require('gulp-jshint')
const stylish = require('jshint-stylish')

const readConfig = require('./lib/config/read-config.js')

gulp.task('blinkForms', () => {
  return readConfig().then((cfg) => {
    const dest = cfg.distPath
    const src = cfg.outputPath

    return gulp.src(`${src}/**/*.js`)
      .pipe(babel({presets: [__dirname + '/node_modules/babel-preset-es2015']}))
      .pipe(angularFilesort())
      .pipe(embedTemplates())
      .pipe(ngAnnotate())
      .pipe(concat('bm-forms.js'))
      .pipe(header('(function (angular) {\n'))
      .pipe(footer('\n})(window.angular);'))
      .pipe(gulp.dest(dest))
  })
})

gulp.task('build', ['blinkForms'], () => {
  return readConfig().then((cfg) => {
    const dest = cfg.distPath
    const src = cfg.outputPath
    const templatePath = cfg.templatePath

    return gulp.src(`${templatePath}/index.html`)
      .pipe(inject(gulp.src([`${dest}/*.js`, __dirname + '/templates/css/*.css', __dirname + '/node_modules/skeleton-framework/dist/skeleton.css'], {read: false})))
      .pipe(gulp.dest(dest))
  })
})

gulp.task('lint', () => {
  return readConfig().then((cfg) => {
    const src = cfg.outputPath

    return gulp.src(`${src}/**/*.js`)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter('fail'))
  })
})

gulp.task('default', ['blinkForms'])
