'use strict'

const t = require('transducers-js')

const templateService = require('../../utils/template-service.js')

// transforms

const elementHTMLRenderer = require('../../transforms/to-element-html.js')
const removeEmptyLines = require('../../transforms/remove-empty-lines.js')
const accum = require('../../accumulators/array-accum.js')

function elementTransducer (allElements) {
  const xf = t.comp(t.map(elementHTMLRenderer(templateService.getByType('html'))),
                    t.map(removeEmptyLines))

  return t.transduce(xf, accum, [], allElements)
}

module.exports = elementTransducer
