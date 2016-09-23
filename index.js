'use strict'

const path = require('path')

const t = require('transducers-js')

// helpers for template processing
const createRendererFn = require('./lib/utils/template-helper.js').createRenderer
const readContents = require('./lib/utils/read-file-contents.js').readContents
const writeSite = require('./lib/write-site.js').writeSite

const getTemplatePaths = require('./lib/utils/get-template-paths.js').getTemplatePaths
const ElementTransducer = require('./lib/transducers/angular1.5/element-HTML-transducer.js').elementTransducer
const formsTransducer = require('./lib/transducers/angular1.5/form-transducer.js').processForm

const definitionPath = './test/fixtures/multi-form-with subform-definition.json'
const outputPath = './output/'

const makeRendererDetails = t.map((templatePath) => Promise.all([
  Promise.resolve(path.basename(templatePath, '.mustache')),
  createRendererFn(templatePath)
]))

// make angular elements transforms
function makeHTML (options) {
  const htmlTemplateGlob = options.viewTemplates
  const jsTemplateGlob = options.scriptTemplates

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

    return readContents(definitionPath).then((definitionStr) => {
      let definition
      try {
        definition = JSON.parse(definitionStr)
      } catch (e) {
        console.log(`Error parsing definition JSON:
${e}`)
        process.exit(1)
      }

      const templateFns = {
        definition,
        elementTransducer,
        jsTemplates: templates.jsTemplates,
        formTemplate: templates.htmlTemplates.form
      }

      return templateFns
    })
  })
  .then(formsTransducer)
  .then((formData) => {
    return writeSite(outputPath, formData)
  })
  .then((formData) => {
    console.log(formData)
  })
  .catch((err) => console.log(err))
}

makeHTML({
  viewTemplates: './templates/angular1.5/html',
  scriptTemplates: './templates/angular1.5/js'
})
