'use strict'

const t = require('transducers-js')
const groupBy = require('lodash.groupby')
const map = require('lodash.map')

const templateService = require('@blinkmobile/forms-template-helper').service

// transforms
const elementHTMLRenderer = require('./to-element-html.js')
const removeEmptyLines = require('./remove-empty-lines.js')

const paginate = require('./pagination-wrapper-template.js')

const accum = (memo, val) => {
  memo.push(val)
  return memo
}

const transformPage = (elements) => {
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
