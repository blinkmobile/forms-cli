'use strict'

const path = require('path')

const t = require('transducers-js')

//const writeFileContents = require('./lib/utils/write-file-contents.js').writeFileContents

// helpers for template processing
const createRendererFn = require('./lib/utils/template-helper.js').createRenderer
const writeSite = require('./lib/write-site.js').writeSite

const getTemplatePaths = require('./lib/utils/get-template-paths.js').getTemplatePaths
const ElementTransducer = require('./lib/transducers/angular1.5/element-HTML-transducer.js').elementTransducer
const formsTransducer = require('./lib/transducers/angular1.5/form-transducer.js').processForm

// get forms from a live answerspace
const getAnswerspaceId = require('./lib/utils/answerspace/fetch-answerspace-id.js')
const getFormDefinition = require('./lib/utils/answerspace/fetch-forms.js')

const outputPath = './output/src/'

const makeRendererDetails = t.map((templatePath) => Promise.all([
  Promise.resolve(path.basename(templatePath, '.mustache')),
  createRendererFn(templatePath)
]))

// make angular elements transforms
function transform (options) {
  const htmlTemplateGlob = options.viewTemplates
  const jsTemplateGlob = options.scriptTemplates
  const answerspace = options.answerspace

  return Promise.all([
    getTemplatePaths(htmlTemplateGlob),
    getTemplatePaths(jsTemplateGlob),
    getAnswerspaceId(answerspace).then(getFormDefinition)
  ]).then((templatePaths) => {
    const htmlTemplatePaths = templatePaths[0]
    const jsTemplatePaths = templatePaths[1]
    const definition = templatePaths[2]

// temp
//writeFileContents('./test/simonspace.json', JSON.stringify(definition))

    return Promise.all([
      Promise.all(t.into([], makeRendererDetails, jsTemplatePaths)),
      Promise.all(t.into([], makeRendererDetails, htmlTemplatePaths))
    ]).then((renderers) => {
      const jsTemplates = t.into({}, t.identity, renderers[0])
      const htmlTemplates = t.into({}, t.identity, renderers[1])
      return {
        jsTemplates,
        htmlTemplates,
        definition
      }
    })
  }).then((templates) => {
    const elementTransducer = ElementTransducer(templates.htmlTemplates)

    return {
      elementTransducer,
      jsTemplates: templates.jsTemplates,
      formTemplate: templates.htmlTemplates.form,
      definition: templates.definition
    }
  })
  .then(formsTransducer)
}

// this is it!
//

transform({
  viewTemplates: './templates/angular1.5/html',
  scriptTemplates: './templates/angular1.5/js',
  answerspace: 'simon'
}).then((formData) => writeSite(outputPath, formData))
  .then((formData) => {
    const gulp = require('gulp')
    require('./gulpfile.js')

    if (gulp.tasks.build) {
      console.log('running gulp task')
      process.nextTick(() => gulp.start('build'))
    }
  })
  //.then((formData) => console.log(formData))
  .catch((err) => console.log(err))

