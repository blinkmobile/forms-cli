'use strict'

const path = require('path')

const gulp = require('gulp')
const babel = require('gulp-babel')
const embedTemplates = require('gulp-angular-embed-templates')
const concat = require('gulp-concat')
const header = require('gulp-header')
const footer = require('gulp-footer')
const ngAnnotate = require('gulp-ng-annotate')
const angularFilesort = require('gulp-angular-filesort')
const inject = require('gulp-inject')
const findUp = require('find-up')

function blinkForms () {
  const dest = process.env.dest
  const src = process.env.src

  const pkgPath = findUp.sync('.blinkmrc.json')

  return gulp.src(`${src}/**/*.js`)
    .pipe(babel({presets: [path.join(path.dirname(pkgPath), 'node_modules', 'babel-preset-es2015')]}))
    .pipe(angularFilesort())
    .pipe(embedTemplates())
    .pipe(ngAnnotate())
    .pipe(concat('bm-forms.js'))
    .pipe(header('(function (angular) {\n'))
    .pipe(footer('\n})(window.angular);'))
    .pipe(gulp.dest(dest))
}

function build () {
  const dest = process.env.dest
  const templatePath = process.env.templatePath
  const pkgPath = findUp.sync('.blinkmrc.json')

  return gulp.src(`${templatePath}/index.html`)
    .pipe(inject(gulp.src([`${dest}/*.js`, path.join(path.dirname(pkgPath), 'node_modules', 'skeleton-framework', 'dist', 'skeleton.css')], {read: false})))
    .pipe(gulp.dest(dest))
}

gulp.task('blinkForms', blinkForms)

gulp.task('build', ['blinkForms'], build)

gulp.task('default', ['build'])
