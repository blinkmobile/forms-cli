'use strict'

const gulp = require('gulp')

const maybeRun = require('@blinkmobile/maybe-run')

function build (cfg) {
  return new Promise((resolve, reject) => {
    const notError = maybeRun(reject)

    process.env.src = cfg.sourcePath
    process.env.dest = cfg.distPath
    process.env.templatePath = cfg.templatePath

    require('./gulpfile.js')

    process.nextTick(() => {
      gulp.start('build', (err) => {
        notError(err) && resolve(cfg)
      })
    })
  })
}

module.exports = build
