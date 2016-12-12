'use strict'

const recast = require('recast')
const types = recast.types
const b = types.builders

function createWrapperFn (...predicates) {
  const ast = b.arrowFunctionExpression(
    [],
    b.blockStatement([])
  )

  // Add the predicate functions to the empty arrow function created above.
  types.visit(ast, {
    visitFunction: (path) => {
      predicates.forEach((fn) => path.get('body', 'body').push(fn))

      return false
    }
  })

  return ast
}

function getListOfPredicateNames (...predicates) {
  return predicates.reduce((memo, p) => {
    types.visit(p, {
      visitVariableDeclaration: (path) => {
        const name = path.get('declarations', 0, 'id', 'name').value

        if (name) {
          memo.push(name)
        }
        // we dont need to traverse down because we have built the function ourselves
        return false
      }
    })

    return memo
  }, [])
}

function makeLogicalExpression (logicalOperator) {
  return (lhs, rhs) => {
    return b.logicalExpression(
      logicalOperator,
      lhs,
      rhs
    )
  }
}

function makeCallExpression (fnName) {
  return b.callExpression(
    b.identifier(fnName),
    []
  )
}

function createMultipleExpression (logicalOperator) {
  return (...predicates) => {
    const ast = createWrapperFn(...predicates)
    const predicateNames = getListOfPredicateNames(...predicates)
    const exp = makeLogicalExpression(logicalOperator)
    let composition
    let i = predicateNames.length - 1
    if (!i) {
      // if there is only one thing being anded (wat?!), just return its value.
      return makeCallExpression(predicateNames[i])
    }

    composition = exp(makeCallExpression(predicateNames[i]), makeCallExpression(predicateNames[--i]))
    while (i > 0) {
      // keep adding && fn() to the predicate composition while we have one
      composition = exp(composition, makeCallExpression(predicateNames[--i]))
      --i
    }

    types.visit(ast, {
      visitFunction: (path) => {
        path.get('body', 'body').push(b.returnStatement(composition))

        return false
      }
    })

    return ast
  }
}

module.exports = createMultipleExpression
