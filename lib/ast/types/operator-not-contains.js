'use strict'

const recast = require('recast')
const b = recast.types.builders

function createContainsExpression (haystack, needle) {
  return b.arrowFunctionExpression(
    [],
    b.binaryExpression(
      '===',
      b.callExpression(
        b.memberExpression(
          b.memberExpression(
            b.memberExpression(
              b.thisExpression(),
              b.identifier('model')
            ),
            b.identifier(haystack)
          ),
          b.identifier('indexOf')
        ),
        [b.literal(needle)]
      ),
      b.unaryExpression('-', b.literal(1))
    )
  )
}

module.exports = createContainsExpression
