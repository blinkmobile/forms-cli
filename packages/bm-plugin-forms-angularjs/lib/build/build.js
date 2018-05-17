'use strict'

const gulp = require('gulp')

const maybeRun = require('@blinkmobile/maybe-run')

function build (cfg) {
  return new Promise((resolve, reject) => {
    const notError = maybeRun(reject)

    cfg.indexHtmlPath = `${cfg.templatePath}/index.html`
    cfg.formBundleName = 'blink-forms-bundle.js'
    cfg.vendorBundleName = 'vendor/vendor.js'

    process.env.src = cfg.sourcePath
    process.env.dest = cfg.distPath
    process.env.templatePath = cfg.templatePath
    process.env.indexHtmlPath = cfg.indexHtmlPath
    process.env.formBundleName = cfg.formBundleName
    process.env.vendorBundleName = cfg.vendorBundleName

    require('./gulpfile.js')

    process.nextTick(() => {
      gulp.start('build', (err) => {
        notError(err) && resolve(cfg)
      })
    })
  })
}

module.exports = build
