'use strict'

const gulp = require('gulp')
const log = require('../lib/logger.js').logger

const maybeReject = require('../lib/utils/maybe-reject-on-error.js')
const readConfig = require('../lib/config/read-config.js')

function build () {
  require('../gulpfile.js')

  return new Promise((resolve, reject) => {
    const maybe = maybeReject(reject)

    if (gulp.tasks.build) {
      log.info('Running build task(s)')
      gulp.start('build', (err) => {
        maybe(err) && resolve(readConfig().then((config) => ({options: config})))
      })
    }
  })
}

module.exports = build
