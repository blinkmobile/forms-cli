'use strict'

const recast = require('recast')
const types = recast.types
const b = types.builders

// Assign a function expression to a property on `this`
function thisMemberExpression (name, fn) {
  return b.expressionStatement(
    b.assignmentExpression(
      '=',
      b.memberExpression(
        b.thisExpression(),
        b.identifier(name)
      ),
      fn
    )
  )
}

module.exports = thisMemberExpression
