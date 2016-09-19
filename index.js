'use strict'

const path = require('path')

const t = require('transducers-js')

// helpers for template processing
const createRendererFn = require('./lib/utils/template-helper.js').createRenderer
const readContents = require('./lib/utils/read-file-contents.js').readContents
const writeFileContents = require('./lib/utils/write-file-contents.js').writeFileContents

const getTemplatePaths = require('./lib/utils/get-template-paths.js').getTemplatePaths
const ElementTransducer = require('./element-HTML-transducer.js').elementTransducer
const formsTransducer = require('./form-transducer.js').processForm

const passThroughTransducer = require('./lib/transforms/pass-through.js')

// dodgy template strings
const header = `<!doctype html>
<html ng-app>
  <head>
    <link rel="stylesheet" href="./css/normalize.css" />
    <link rel="stylesheet" href="./css/skeleton.css" />
    <link rel="stylesheet" href="./css/demo.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
  </head>
  <body>
  <p>{{'i have been enhanced by angular!'}}</p>
      `

const footer = `
  </body>
</html>`

// const formTemplatePath = './templates/angular1.5/html/form.mustache'
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
  ]).then((results) => {
    const htmlTemplatePaths = results[0]
    const jsTemplatePaths = results[1]
    return Promise.all([
      Promise.all(t.into([], makeRendererDetails, jsTemplatePaths)),
      Promise.all(t.into([], makeRendererDetails, htmlTemplatePaths))
    ]).then((results) => {
      const jsTemplates = t.into({}, t.identity, results[0])
      const htmlTemplates = t.into({}, t.identity, results[1])
      return {
        jsTemplates,
        htmlTemplates
      }
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
      // return result.then((forms) => {
      const formNames = Object.keys(formData)
      formNames.forEach((formName) => {
        const form = formData[formName]
        if (!form) {
          return
        }

        const module = form.module
        writeFileContents(path.join(outputPath, formName, 'js', `${formName}-module.js`), module)

        const controllers = form.controllers
        const controllerNames = Object.keys(controllers)
        controllerNames.forEach((name) => writeFileContents(path.join(outputPath, formName, 'js', name + '.js'), controllers[name]).catch((err) => console.log(err)))

        const views = form.views
        const viewNames = Object.keys(views)
        viewNames.forEach((name) => writeFileContents(path.join(outputPath, formName, 'templates', name + '.html'), views[name]).catch((err) => console.log(err)))
      })

      return formData
    })
  })
  .then(passThroughTransducer((definition) => writeFileContents('output/definition.js', JSON.stringify(definition))))
  .catch((err) => console.log(err))
}

makeHTML({
  viewTemplates: './templates/angular1.5/html',
  scriptTemplates: './templates/angular1.5/js'
})
