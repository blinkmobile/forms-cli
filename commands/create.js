'use strict'

const log = require('../lib/logger.js').logger

// helpers
const writeSite = require('../lib/write-site.js').writeSite
const templateService = require('../lib/utils/template-service.js')
// we will eventually need to be able to dynamically require this (eg for angular2 or react transforms)
const formsTransducer = require('../lib/transducers/angular1.5/form-transducer.js').processForm
const normalisationTransducer = require('../lib/transducers/normalisation.js').normaliseForm

// get forms from a live answerspace
const getAnswerspaceId = require('../lib/utils/answerspace/fetch-answerspace-id.js')
const getFormDefinition = require('../lib/utils/answerspace/fetch-forms.js')

const finishMessage = require('../lib/finish-message.js')

// make angular elements transforms
function normalise (options) {
  const answerspace = options.answerspace
  return Promise.all([
    getAnswerspaceId(answerspace).then(getFormDefinition),
    templateService.load(options.templates)
  ]).then((data) => data[0].map((f) => normalisationTransducer(f)))
}

function compile (options) {
  const outputPath = options.outputPath

  return normalise(options)
    .then((normalisedForms) => formsTransducer(normalisedForms))
    .then((formData) => writeSite(outputPath, formData))
    .then((formData) => {
      const gulp = require('gulp')
      require('../gulpfile.js')

      return new Promise((resolve, reject) => {
        if (gulp.tasks.build) {
          log.info('Running build task(s)')
          gulp.start('build', (err) => {
            if (err) {
              return reject(err)
            }

            resolve()
          })
        }
      })
    }).then(() => {
      const footer = `

(c) ${(new Date()).getUTCFullYear()} Blink Mobile Interactive`
      log.info(finishMessage`${options.framework} ${outputPath}` + footer)
    })
}

// simulate a user passing running `node index.js` with a config file.
//
module.exports = () => {
  return compile({
    templates: {
      viewTemplates: './templates/angular1.5/html/*.mustache',
      scriptTemplates: './templates/angular1.5/js/*.mustache',
      schemaTemplates: './templates/json-schema/*.mustache'
    },
    answerspace: 'simon',
    outputPath: './output/src/',
    framework: 'AngularJS'
  }).catch((err) => log.error(err))
}
