'use strict'

const t = require('transducers-js')

// transforms
const flatten = require('./lib/transforms/flatten-definition.js')
const elementHTMLRenderer = require('./lib/transforms/to-element-html.js')
const fixChoice = require('./lib/transforms/fix-choice.js')
const fixHeadings = require('./lib/transforms/fix-headings.js')
const removeEmptyLines = require('./lib/transforms/remove-empty-lines.js')

// filters
const inForm = require('./lib/filters/element-in-form.js')

function elementTransducer (templates) {
  return (variationName, allElements, formElements) => {
    const accum = (memo, val) => {
      memo.push(val)
      return memo
    }

    const xf = t.comp(t.map(flatten(variationName)),
                      t.filter(inForm(formElements)),
                      t.map(fixChoice),
                      t.map(fixHeadings),
                      t.map(elementHTMLRenderer(templates)),
                      t.filter((str) => typeof str === 'string'), // temp - subforms making things blow up
                      t.map(removeEmptyLines))

    return t.transduce(xf, accum, [], allElements)
  }
}

module.exports = {elementTransducer}
