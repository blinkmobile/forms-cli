'use strict'

const path = require('path')

const t = require('transducers-js')

// helpers for template processing
const createRendererFn = require('./lib/utils/template-helper.js').createRenderer
const writeSite = require('./lib/write-site.js').writeSite

const getTemplatePaths = require('./lib/utils/get-template-paths.js').getTemplatePaths
const ElementTransducer = require('./lib/transducers/angular1.5/element-HTML-transducer.js').elementTransducer
const formsTransducer = require('./lib/transducers/angular1.5/form-transducer.js').processForm

// get forms from a live answerspace
const getAnswerspaceId = require('./lib/utils/answerspace/fetch-answerspace-id.js')
const getFormDefinition = require('./lib/utils/answerspace/fetch-forms.js')

const outputPath = './output/'

const makeRendererDetails = t.map((templatePath) => Promise.all([
  Promise.resolve(path.basename(templatePath, '.mustache')),
  createRendererFn(templatePath)
]))

// dodgy!
let index

// make angular elements transforms
function transform (options) {
  const htmlTemplateGlob = options.viewTemplates
  const jsTemplateGlob = options.scriptTemplates
  const definition = options.definition

  return Promise.all([
    getTemplatePaths(htmlTemplateGlob),
    getTemplatePaths(jsTemplateGlob)
  ]).then((templatePaths) => {
    const htmlTemplatePaths = templatePaths[0]
    const jsTemplatePaths = templatePaths[1]
    return Promise.all([
      Promise.all(t.into([], makeRendererDetails, jsTemplatePaths)),
      Promise.all(t.into([], makeRendererDetails, htmlTemplatePaths))
    ]).then((renderers) => {
      const jsTemplates = t.into({}, t.identity, renderers[0])
      const htmlTemplates = t.into({}, t.identity, renderers[1])
      return {
        jsTemplates,
        htmlTemplates
      }
    })
  }).then((templates) => {
    const elementTransducer = ElementTransducer(templates.htmlTemplates)
    index = templates.htmlTemplates.index

    return {
      definition,
      elementTransducer,
      jsTemplates: templates.jsTemplates,
      formTemplate: templates.htmlTemplates.form
    }
  })
  .then(formsTransducer)
}

// this is it!
//

getAnswerspaceId('simon')
  .then(getFormDefinition)
  .then((def) => {
    return transform({
      viewTemplates: './templates/angular1.5/html',
      scriptTemplates: './templates/angular1.5/js',
      definition: def
    })
  }).then((formData) => {
    return writeSite(outputPath, formData, index)
  })
// .then((formData) => {
//   console.log(formData)
// })
  .catch((err) => console.log(err))
