'use strict'

const t = require('transducers-js')

// transforms

const elementHTMLRenderer = require('../../transforms/to-element-html.js')
const fixChoice = require('../../transforms/fix-choice.js')
const fixHeadings = require('../../transforms/fix-headings.js')
const removeEmptyLines = require('../../transforms/remove-empty-lines.js')
const accum = require('../../accumulators/array-accum.js')

function elementTransducer (templates) {
  return (allElements) => {
    const xf = t.comp(t.filter((el) => (el.type !== 'message' && el.type !== 'button' && el.type !== 'draw' && el.type !== 'location')),
                      t.map(fixChoice),
                      t.map(fixHeadings),
                      t.map(elementHTMLRenderer(templates)),
                      t.map((el) => {
                        console.log('element=', el)
                        return el
                      }),
                      t.map(removeEmptyLines))

    return t.transduce(xf, accum, [], allElements)
  }
}

module.exports = {elementTransducer}
