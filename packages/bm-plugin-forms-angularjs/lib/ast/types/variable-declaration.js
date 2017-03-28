'use strict'

const recast = require('recast')
const types = recast.types
const b = types.builders

// Turn a function expression into a const/let/var variable
function variableDeclaration (name, fn, variableType) {
  return b.variableDeclaration(
    variableType || 'const',
    [b.variableDeclarator(
      b.identifier(name),
      fn
    )]
  )
}

module.exports = variableDeclaration
