'use strict'

function insertComponentLifecycleHook (controllerBody, lifecyleHook, fn) {
  const controllerExpression = controllerBody.value.find((node) =>
    node.type === 'ExpressionStatement' &&
    node.expression.left.property.name === lifecyleHook
  )
  if (!controllerExpression) {
    throw new Error(`Could not find a lifecycle hook expression for: ${lifecyleHook}`)
  }
  controllerExpression.expression.right.body.body.push(fn)
}

module.exports = insertComponentLifecycleHook
