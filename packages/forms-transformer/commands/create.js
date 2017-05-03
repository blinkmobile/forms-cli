'use strict'

const debugLogger = require('../lib/logger/loggers.js').debugLogger
const userLogger = require('../lib/logger/loggers.js').userLogger

// helpers
const writeSite = require('../lib/write-site.js').writeSite
const loadPlugin = require('../lib/plugin-system/load-plugin.js')
const formsTransducer = require('../lib/transducers/framework.js')

const decide = require('../lib/utils/decide-on-normalisation-fns.js')

const readConfig = require('../lib/config/read-config.js')
const buildCommand = require('./build.js')

function compile (options, cmdFlags) {
  userLogger.info('Creating Form Source files')

  debugLogger.debug('Start Transformation')
  debugLogger.debug(`.blinkmrc.json: ${JSON.stringify(options)}`)

  const plugin = loadPlugin(options.framework)
  const transformer = formsTransducer(plugin.processForm)
  const normaliser = decide(options)

  return plugin.init(options)
    .then(() => normaliser())
    .then((normalisedForms) => transformer(normalisedForms))
    .then((formData) => writeSite(options.sourcePath, formData))
    .then((formData) => cmdFlags.build ? buildCommand().then(() => ({formData, options})) : {formData, options})
}

module.exports = (input, flags) => readConfig().then((config) => compile(config, flags))
