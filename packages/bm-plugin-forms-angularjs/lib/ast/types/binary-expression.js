'use strict'

const recast = require('recast')
const b = recast.types.builders

/*
input:
  createBinaryExpression('==')(lhs, rhs)
output:
  () => this.model.lhs == rhs

input:
  createBinaryExpression('>')(lhs, rhs)
output:
  () => this.model.lhs > rhs
 */
function createBinaryExpression (operator) {
  return (lhs, rhs) => {
    return b.arrowFunctionExpression(
      [],
      b.binaryExpression(
        operator,
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
}

module.exports = createBinaryExpression
