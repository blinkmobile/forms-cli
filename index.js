'use strict'

const fs = require('fs')
const path = require('path')

const t = require('transducers-js')

// helpers for template processing
const createRendererFn = require('./lib/utils/template-helper.js').createRenderer
const readContents = require('./lib/utils/read-file-contents.js').readContents

// transforms
const flatten = require('./lib/transforms/flatten-definition.js')
const elementHTMLRenderer = require('./lib/transforms/to-element-html.js')
const fixChoice = require('./lib/transforms/fix-choice.js')

// filters
const inForm = require('./lib/filters/element-in-form.js')

const getTemplatePaths = require('./lib/utils/get-template-paths.js').getTemplatePaths

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
    <form novalidate>
      `

const footer = `
    </form>

  </body>
</html>`

const makeRendererDetails = t.map((templatePath) => Promise.all([
  Promise.resolve(path.basename(templatePath, '.mustache')),
  createRendererFn(templatePath)
]))

getTemplatePaths('./templates/angular1.5/html').then((templatePaths) => {
  return Promise.all(t.into([], makeRendererDetails, templatePaths))
    .then((templates) => t.into({}, t.identity, templates))
    .then((templates) => {
      return readContents('./test/fixtures/forms2-simple-form-definition.json')
        .then((contents) => {
          try {
            contents = JSON.parse(contents)
          } catch (e) {
            console.log(`Error parsing JSON: ${e}`)
            process.exit(1)
          }

          contents = contents[0]
          const elements = contents.default._elements
          const addElements = contents.add._elements

          const accum = (memo, val) => {
            memo.push(val)
            return memo
          }

          const wrapInDiv = (html) => `<div class="row">
    ${html}
  </div>
  `
          const makefullLength = (el) => {
            el.rowClass = el.rowClass ? el.rowClass + ' u-full-width' : 'u-full-width'
            return el
          }
          const xf = t.comp(t.map(flatten('add')),
                            t.filter(inForm(addElements)),
                            t.map(fixChoice),
                            t.map(makefullLength),
                            t.map(elementHTMLRenderer(templates)),
                            t.map(wrapInDiv))

          return t.transduce(xf, accum, [], elements)
        })
    })
  .then((form) => fs.writeFile('output/index.html', [header].concat(form).concat(footer).join('')))
  .catch((err) => console.log(err))
})
