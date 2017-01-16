'use strict'

function insertComponentLifecycleHook (controllerBody, property, fn) {
  const controllerExpression = controllerBody.value.find((node) =>
    node.type === 'ExpressionStatement' &&
    node.expression.left.property.name === property
  )
  controllerExpression.expression.right.body.body.push(fn)
}

module.exports = insertComponentLifecycleHook
