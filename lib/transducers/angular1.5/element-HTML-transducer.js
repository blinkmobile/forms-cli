'use strict'

const t = require('transducers-js')
const groupBy = require('lodash.groupby')
const map = require('lodash.map')

const templateService = require('../../utils/template-service.js')

// transforms

const elementHTMLRenderer = require('../../transforms/to-element-html.js')
const removeEmptyLines = require('../../transforms/remove-empty-lines.js')
const accum = require('../../accumulators/array-accum.js')

const paginate = require('../../html-wrappers/paginate.js')

function transformPage (elements) {
  const xf = t.comp(t.map(elementHTMLRenderer(templateService.getByType('html'))),
                    t.map(removeEmptyLines))

  return t.transduce(xf, accum, [], elements)
}

function elementTransducer (allElements, pages) {
  if (pages.length === 1) {
    return transformPage(allElements)
  }

  const elementsByPage = groupBy(allElements, (el) => el.page)

  return map(elementsByPage, (els, pageIndex) => paginate`${transformPage(els).join('')}${pageIndex}`)
}

module.exports = elementTransducer
