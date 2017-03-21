'use strict'

// helpers
const writeSite = require('../lib/write-site.js').writeSite
const templateService = require('../lib/utils/template-service.js')
const lazyWriter = require('../lib/utils/write-file-contents.js').lazyWriter

// we will eventually need to be able to dynamically require this (eg for angular2 or react transforms)
const formsTransducer = require('../lib/transducers/framework.js')
const normalisationTransducer = require('../lib/transducers/normalisation.js').normaliseForm

// get forms from a live answerspace
const getAnswerspaceId = require('../lib/utils/answerspace/fetch-answerspace-id.js')
const getFormDefinition = require('../lib/utils/answerspace/fetch-forms.js')

const readConfig = require('../lib/config/read-config.js')
const buildCommand = require('./build.js')

// make angular elements transforms
function normalise (options) {
  const answerspace = options.answerspace
  return Promise.all([
    getAnswerspaceId(answerspace).then(getFormDefinition),
    templateService.load(options.templatePath)
  ]).then((data) => data[0].map((f) => normalisationTransducer(f)))
}

function compile (options, cmdFlags) {
  const transformer = formsTransducer(`forms-${options.framework}`)
  return normalise(options)
    .then((normalisedForms) => transformer(normalisedForms))
    .then((formData) => writeSite(options.outputPath, formData))
    .then((formData) => cmdFlags.build ? buildCommand().then(() => ({formData, options})) : {formData, options})
}

module.exports = (input, flags) => readConfig().then((config) => compile(config, flags))
