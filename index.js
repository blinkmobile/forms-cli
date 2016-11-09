'use strict'

// helpers
const writeSite = require('./lib/write-site.js').writeSite
const templateService = require('./lib/utils/template-service.js')
const writeFormSchema = require('./lib/json-schema/write-form-schema.js')
const formsTransducer = require('./lib/transducers/angular1.5/form-transducer.js').processForm
const transformEvents = require('./lib/transducers/angular1.5/form-transducer.js').processingEvents
const EVENT_NAMES = require('./lib/transducers/angular1.5/form-transducer.js').EVENT_NAMES

// get forms from a live answerspace
const getAnswerspaceId = require('./lib/utils/answerspace/fetch-answerspace-id.js')
const getFormDefinition = require('./lib/utils/answerspace/fetch-forms.js')

const logError = (err) => console.log(err)

// make angular elements transforms
function transform (options) {
  const answerspace = options.answerspace
  return Promise.all([
    getAnswerspaceId(answerspace).then(getFormDefinition),
    templateService.load(options.templates)
  ]).then((data) => formsTransducer(data[0]))
}

function compile (options) {
  const outputPath = options.outputPath

  transformEvents.on(EVENT_NAMES.EVENT_FORM_NORMALISED, (form) => {
    writeFormSchema(outputPath, form)
  })

  return transform(options)
    .then((formData) => writeSite(outputPath, formData))
    .then((formData) => {
      const gulp = require('gulp')
      require('./gulpfile.js')

      if (gulp.tasks.build) {
        console.log('running gulp task(s)')
        process.nextTick(() => gulp.start('build'))
      }
    })
}

// simulate a user passing running `node index.js` with a config file.
//
compile({
  templates: {
    viewTemplates: './templates/angular1.5/html/*.mustache',
    scriptTemplates: './templates/angular1.5/js/*.mustache',
    schemaTemplates: './templates/json-schema/*.mustache'
  },
  answerspace: 'simon',
  outputPath: './output/src/'
}).catch(logError)
