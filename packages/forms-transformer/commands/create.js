'use strict'

const url = require('url')

const debugLogger = require('../lib/logger/loggers.js').debugLogger
const userLogger = require('../lib/logger/loggers.js').userLogger

// helpers
const writeSite = require('../lib/write-site.js').writeSite
const loadPlugin = require('../lib/plugin-system/load-plugin.js')

const formsTransducer = require('../lib/transducers/framework.js')
const normalisationTransducer = require('../lib/transducers/normalisation.js').normaliseForm

// get forms from a live answerspace
const getAnswerspaceId = require('../lib/utils/answerspace/fetch-answerspace-id.js')
const getFormDefinition = require('../lib/utils/answerspace/fetch-forms.js')

const readConfig = require('../lib/config/read-config.js')
const buildCommand = require('./build.js')

const hostName = (_, answerspaceUrl) => {
  const u = url.parse(answerspaceUrl)

  return `${u.protocol}//${u.host}`
}

// make angular elements transforms
function normalise (options) {
  const answerspace = options.answerspace
  const answerspaceDetails = {
    answerspaceName: answerspace,
    platformURL: hostName`${answerspace}`
  }

  return getAnswerspaceId(answerspace)
    .then((id) => {
      answerspaceDetails.answerspaceId = id

      return getFormDefinition(answerspace, id)
    })
    .then((data) => data.map((f) => normalisationTransducer(f, answerspaceDetails)))
}

function compile (options, cmdFlags) {
  userLogger.info('Creating Form Source files')

  debugLogger.debug('Start Transformation')
  debugLogger.debug(`.blinkmrc.json: ${JSON.stringify(options)}`)

  const plugin = loadPlugin(options.framework)
  const transformer = formsTransducer(plugin.processForm)

  return plugin.init(options)
    .then(() => normalise(options))
    .then((normalisedForms) => transformer(normalisedForms))
    .then((formData) => writeSite(options.outputPath, formData))
    .then((formData) => cmdFlags.build ? buildCommand().then(() => ({formData, options})) : {formData, options})
}

module.exports = (input, flags) => readConfig().then((config) => compile(config, flags))
