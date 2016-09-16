'use strict'

const fs = require('fs')
const path = require('path')

const t = require('transducers-js')

// helpers for template processing
const createRendererFn = require('./lib/utils/template-helper.js').createRenderer
const readContents = require('./lib/utils/read-file-contents.js').readContents

const getTemplatePaths = require('./lib/utils/get-template-paths.js').getTemplatePaths
const ElementTransducer = require('./element-HTML-transducer.js').elementTransducer
const formsTransducer = require('./form-transducer.js').processForm

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

const formTemplatePath = './templates/angular1.5/html/form.mustache'
const definitionPath = './test/fixtures/multi-form-with subform-definition.json'

const makeRendererDetails = t.map((templatePath) => Promise.all([
  Promise.resolve(path.basename(templatePath, '.mustache')),
  createRendererFn(templatePath)
]))

// make angular elements transforms
function makeHTML (tp) {
  return getTemplatePaths(tp).then((templatePaths) => {
    return Promise.all(t.into([], makeRendererDetails, templatePaths))
      .then((templates) => t.into({}, t.identity, templates))
      .then((templates) => {
        const elementTransducer = ElementTransducer(templates)

        return Promise.all([
          readContents(definitionPath),
          createRendererFn(formTemplatePath),
          createRendererFn('./templates/angular1.5/js/form-controller.js')
        ]).then((results) => {
          let definition
          const formTemplate = results[1]
          const formControllerTemplate = results[2]
          try {
            definition = JSON.parse(results[0])
          } catch (e) {
            console.log(`Error parsing definition JSON:
  ${e}`)
            process.exit(1)
          }

          return {
            definition,
            formTemplate,
            formControllerTemplate,
            elementTransducer
          }
        })
      })
      .then((results) => formsTransducer(results))
      //.then((formDefinition) => fs.writeFile('output/definition.json', JSON.stringify(formDefinition)))
      .then((forms) => {
        const keys = Object.keys(forms)
        keys.forEach((key) => {
          const formNames = Object.keys(forms[key])
          formNames.forEach((name) => fs.writeFile(path.join('output', `${name}.html`), `${header}${forms[key][name]}${footer}`))
        })
      })
      .catch((err) => console.log(err))
  })
}

function makeJS () {

}

makeHTML('./templates/angular1.5/html')
