'use strict'

const templateService = require('@blinkmobile/forms-template-helper').service

// ast related
const insertConditionalLogic = require('../ast/insert-conditional-logic.js')
const insertSignatureLogic = require('../ast/insert-signature-logic.js')
const removeNodeFrom = require('../ast/remove-node-from.js')

function makeControllerRenderers ({form, pages}) {
  const jsTemplates = templateService.getByType('js')
  const template = jsTemplates['form-controller.js']

  let fn = template(form)

  if (form._checks.length) {
    fn = insertConditionalLogic(fn, form._checks)
  }

  const drawElements = form._elements.filter((el) => el.type.toLowerCase() === 'draw')
  if (drawElements.length) {
    fn = insertSignatureLogic(fn, drawElements)
  }

  if (!pages) {
    fn = removeNodeFrom('MemberExpression')(fn, (name, node) => node.name === 'changePageBy')
  }

  return fn
}

module.exports = makeControllerRenderers
