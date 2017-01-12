'use strict'

const t = require('transducers-js')

const templateService = require('../../utils/template-service.js')

// transforms

const elementHTMLRenderer = require('../../transforms/to-element-html.js')
const fixChoice = require('../../transforms/fix-choice.js')
const fixHeadings = require('../../transforms/fix-headings.js')
const removeEmptyLines = require('../../transforms/remove-empty-lines.js')
const accum = require('../../accumulators/array-accum.js')

function elementTransducer (allElements) {
  const xf = t.comp(t.filter((el) => (el.type !== 'message' && el.type !== 'button' && el.type !== 'location')),
                    t.map(fixChoice),
                    t.map(fixHeadings),
                    t.map(elementHTMLRenderer(templateService.getByType('viewTemplates'))),
                    t.map(removeEmptyLines))

  return t.transduce(xf, accum, [], allElements)
}

module.exports = elementTransducer
