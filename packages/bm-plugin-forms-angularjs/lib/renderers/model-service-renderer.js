'use strict'

const templateService = require('@blinkmobile/forms-template-helper').service

function makeModelServiceRenderers (form) {
  const jsTemplates = templateService.getByType('js')
  const template = jsTemplates['model-service.js']

  let fn = template(form)

  return fn
}

module.exports = makeModelServiceRenderers
