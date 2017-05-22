'use strict'

const templateService = require('@blinkmobile/forms-template-helper').service
const elementTransducer = require('../transform/element-HTML-transformer.js')

function makeHTMLRenderers ({form, pages}) {
  const htmlTemplates = templateService.getByType('html')
  const formTemplate = htmlTemplates.form

  form.elements = elementTransducer(form._elements, pages, form.moduleName).join('')

  let formHtml = formTemplate(form)
  if (pages && pages.length > 1 && htmlTemplates['pagination']) {
    const paginationTemplate = htmlTemplates['pagination']
    formHtml += paginationTemplate(form)
  }

  return formHtml
}

module.exports = makeHTMLRenderers
