'use strict'

const recast = require('recast')
const b = recast.types.builders

/*
Creates a function that checks if 'needle' exists in the 'haystack'
property on the form model.

input:
  createContainsExpression('fieldName', value)
output:
  () => this.model.fieldName.indexOf(value) > -1
 */
function createContainsExpression (haystack, needle) {
  return b.arrowFunctionExpression(
    [],
    b.binaryExpression(
      '>',
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
