'use strict'

const t = require('transducers-js')

// transforms
const flatten = require('../../transforms/flatten-definition.js')
const elementHTMLRenderer = require('../../transforms/to-element-html.js')
const fixChoice = require('../../transforms/fix-choice.js')
const fixHeadings = require('../../transforms/fix-headings.js')
const removeEmptyLines = require('../../transforms/remove-empty-lines.js')

// filters
const inForm = require('../../filters/element-in-form.js')

const accum = require('../../accumulators/array-accum.js')

function elementTransducer (templates) {
  return (variationName, allElements, formElements) => {
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
