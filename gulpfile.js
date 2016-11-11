'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const embedTemplates = require('gulp-angular-embed-templates')
const angularModule = require('gulp-angular-module')
const concat = require('gulp-concat')
const header = require('gulp-header')
const footer = require('gulp-footer')
const cached = require('gulp-cached')
const remember = require('gulp-remember')
const ngAnnotate = require('gulp-ng-annotate')
// const deporder = require('gulp-ng-deporder')
const angularFilesort = require('gulp-angular-filesort')
const inject = require('gulp-inject')
const jshint = require('gulp-jshint')
const stylish = require('jshint-stylish')

const build = './output/build'
const dest = './output/dest'

gulp.task('blinkForms', () => {
  gulp.src('output/src/**/*.js')
      .pipe(babel({presets: ['es2015']}))
      .pipe(angularFilesort())
      // .pipe(deporder())
      // .pipe(cached('scripts'))
      .pipe(embedTemplates())
      // .pipe(angularModule())
      // .pipe(remember('scripts'))
      .pipe(ngAnnotate())
      .pipe(concat('blink.js'))
      .pipe(header('(function (angular) {\n'))
      .pipe(footer('\n})(window.angular);'))
      .pipe(gulp.dest(dest))
})

gulp.task('build', ['blinkForms'], () => {
  gulp.src('./templates/angular1.5/index.html')
    .pipe(inject(gulp.src([`${dest}/blink.js`, './output/css/*.css'])))
    .pipe(gulp.dest(dest))
})

gulp.task('lint', () => {
  gulp.src('output/src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
})

// gulp.task('module', () => {
//   gulp.src('output/src/**/*-module.js')
//     .pipe(angularModule())
//     .pipe(gulp.dest(build))
// })

gulp.task('concat', () => {
  gulp.src(`${build}/**/*.js`)
    .pipe(concat('blink.js'))
    .pipe(gulp.dest(dest))
})

gulp.task('default', ['blinkForms'])