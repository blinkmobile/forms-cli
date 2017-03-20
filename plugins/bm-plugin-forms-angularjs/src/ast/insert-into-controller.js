'use strict'

const recast = require('recast')
const types = recast.types

function insertIntoController (fnSource, add) {
  const targetFn = recast.parse(fnSource)

  types.visit(targetFn, {
    visitFunction: (path) => {
      if (!/Controller$/i.test(path.node.id.name)) {
        // we only insert into controllers
        return
      }
      add(path)

      // there should only be one function in the source, so exit
      return false
    }
  })
  return recast.print(targetFn, {quote: 'single', tabWidth: 2}).code
}

module.exports = insertIntoController
