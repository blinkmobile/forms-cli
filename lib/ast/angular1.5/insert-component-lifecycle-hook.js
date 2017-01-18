'use strict'

const recast = require('recast')
const types = recast.types
const b = types.builders

const thisMemberExpression = require('../types/this-member-expression.js')

function createLifecycleHook (lifecyleHook, fn) {
  const params = []
  if (lifecyleHook === '$onChanges') {
    params.push(b.identifier('changesObj'))
  }
  return thisMemberExpression(lifecyleHook,
    b.arrowFunctionExpression(
      params,
      b.blockStatement([fn])
    )
  )
}

function insertComponentLifecycleHook (controllerBody, lifecyleHook, fn) {
  const controllerExpression = controllerBody.value.find((node) =>
    node.type === 'ExpressionStatement' &&
    node.expression.left.property.name === lifecyleHook
  )

  if (controllerExpression) {
    controllerExpression.expression.right.body.body.push(fn)
  } else {
    const lifecyleHookExpression = createLifecycleHook(lifecyleHook, fn)
    controllerBody.push(lifecyleHookExpression)
  }
}

module.exports = insertComponentLifecycleHook
