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

function elementTransducer (allElements, pages, moduleName) {
  if (pages.length === 1) {
    return transformPage(allElements)
  }

  // if no elements are in the definition, add a header indicating there are no elements
  if (allElements.length < 1) {
    allElements.push({
      'name': '_noelements',
      'type': 'heading',
      'text': 'You have not yet added any form elements',
      'position': 'left',
      'fontFace': 'arial',
      'page': 0,
      'headingType': 4
    })
  }

  const elementsByPage = groupBy(allElements, (el) => el.page)

  return map(elementsByPage, (els, pageIndex) => paginate`${transformPage(els).join('')}${pageIndex}${moduleName}`)
}

module.exports = elementTransducer
