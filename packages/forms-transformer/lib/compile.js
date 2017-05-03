'use strict'

const debugLogger = require('../lib/logger/loggers.js').debugLogger
const userLogger = require('../lib/logger/loggers.js').userLogger

function compile (options, normaliser) {
  userLogger.info('Creating Form Source files')

  debugLogger.debug('Start Transformation')
  debugLogger.debug(`.blinkmrc.json: ${JSON.stringify(options)}`)

  const plugin = loadPlugin(options.framework)
  const transformer = formsTransducer(plugin.processForm)

  return plugin.init(options)
    .then(() => normaliser(options))
    .then((normalisedForms) => transformer(normalisedForms))
    .then((formData) => writeSite(options.sourcePath, formData))
}

module.exports = compile
