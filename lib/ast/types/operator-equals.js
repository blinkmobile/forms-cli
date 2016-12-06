'use strict'

const recast = require('recast')
const b = recast.types.builders

function createEqualsExpression (lhs, rhs) {
  return b.arrowFunctionExpression(
    [],
    b.binaryExpression(
      '==',
      b.memberExpression(
        b.memberExpression(
          b.thisExpression(),
          b.identifier('model')
        ),
        b.identifier(lhs)
      ),
      b.literal(rhs)
    )
  )
}

module.exports = createEqualsExpression
