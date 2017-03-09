'use strict'

const recast = require('recast')
const types = recast.types

function removeNodeFrom (type) {
  return function removeNode (code, predicate) {
    const ast = recast.parse(code)

    types.visit(ast, {
      [`visit${type}`]: function (path) {
        const node = path.node

        if (types.namedTypes[type].check(node) && types.someField(node, predicate)) {
          path.parentPath.prune()
        }
        this.traverse(path)
      }
    })

    return recast.print(ast).code
  }
}

module.exports = removeNodeFrom
