'use strict'

const recast = require('recast')
const b = recast.types.builders

function createContainsExpression () {
  return b.arrowFunctionExpression(
    [b.identifier('needle'), b.identifier('haystack')],
    b.binaryExpression(
      '>',
      b.callExpression(
        b.memberExpression(
          b.identifier('haystack'),
          b.identifier('indexOf')
        ),
        [b.identifier('needle')]
      ),
      b.unaryExpression('-', b.literal(1))
    )
  )
}

module.exports = createContainsExpression
