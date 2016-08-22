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

// dodgy template strings
const header = `<html>
  <head>
    <link rel="stylesheet" href="./css/normalize.css" />
    <link rel="stylesheet" href="./css/skeleton.css" />
    <link rel="stylesheet" href="./css/demo.css" />
  </head>
  <body>
    <form>
      `

const footer = `
    </form>
  </body>
</html>`

const templatePaths = [
  './templates/html/text.mustache',
  './templates/html/url.mustache',
  './templates/html/telephone.mustache',
  './templates/html/password.mustache',
  './templates/html/number.mustache',
  './templates/html/email.mustache',
  './templates/html/textarea.mustache',
  './templates/html/date.mustache',
  './templates/html/datetime.mustache',
  './templates/html/select.mustache',
  './templates/html/radio.mustache',
  './templates/html/checkbox.mustache'
]

const makeRendererDetails = t.map((templatePath) => Promise.all([
  Promise.resolve(path.basename(templatePath, '.mustache')),
  createRendererFn(templatePath)
]))

Promise.all(t.into([], makeRendererDetails, templatePaths))
  .then((templates) => t.into({}, t.identity, templates))
  .then((templates) => {
    return readContents('./test/fixtures/forms2-simple-form-definition.json')
      .then((contents) => {
        contents = JSON.parse(contents)

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

        const xf = t.comp(t.map(flatten('add')),
                          t.filter(inForm(addElements)),
                          t.map(fixChoice),
                          t.map(elementHTMLRenderer(templates)),
                          t.map(wrapInDiv))

        return t.transduce(xf, accum, [], elements)
      })
  })
.then((form) => fs.writeFile('output/index.html', [header].concat(form).concat(footer).join('')))
.catch((err) => console.log(err))
