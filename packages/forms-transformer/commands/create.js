'use strict'

const path = require('path')

const debugLogger = require('../lib/logger/loggers.js').debugLogger
const userLogger = require('../lib/logger/loggers.js').userLogger

// helpers
const writeSite = require('../lib/write-site.js').writeSite

const compile = require('../lib/compile.js')
const decide = require('../lib/utils/decide-on-normalisation-fns.js')

const readConfig = require('../lib/config/read-config.js')
const buildCommand = require('./build.js')

function create (options, cmdFlags) {
  userLogger.info('Creating Form framework source files...')

  debugLogger.debug('Start Transformation')
  debugLogger.debug(`.blinkmrc.json: ${JSON.stringify(options)}`)

  return compile(options, decide(options))
    .then((formData) => writeSite(options.sourcePath, formData))
    .then((formData) => {
      userLogger.info(`Finished creating framework source files.
Source files location: ${path.resolve(options.sourcePath)}
`)
      if (cmdFlags.build) {
        return buildCommand()
      }
    })
}

module.exports = (input, flags) => readConfig().then((config) => create(config, flags))
