'use strict'

const templateService = require('@blinkmobile/forms-template-helper').service
const elementTransducer = require('../transform/element-HTML-transformer.js')

function makeHTMLRenderers ({formData, pages}) {
  const htmlTemplates = templateService.getByType('html')
  const formTemplate = htmlTemplates.form

  formData.elements = elementTransducer(formData._elements, pages).join('')

  let formHtml = formTemplate(formData)
  if (pages.length > 1 && htmlTemplates['pagination']) {
    const paginationTemplate = htmlTemplates['pagination']
    formHtml += paginationTemplate(formData)
  }

  return formHtml
}

module.exports = makeHTMLRenderers
