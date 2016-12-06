'use strict'

const recast = require('recast')
const types = recast.types
const b = types.builders

const operators = {
  'contains': require('../types/operator-contains.js'),
  '==': require('../types/operator-equals.js')
}

function modifySource (fnSource, additions) {
  const targetFn = recast.parse(fnSource)

  types.visit(targetFn, {
    visitFunction: (path) => {
      if (!/Controller$/i.test(path.node.id.name)) {
        // we only insert into controllers
        return
      }
      additions.forEach((fn) => path.get('body', 'body').unshift(fn))

      // there should only be one function in the source, so exit
      return false
    }
  })
  return recast.print(targetFn, {quote: 'single', tabWidth: 2}).code
}

// When we insert code into angular controllers we need to make it a member expression
// eg this.fn = () => blah
// so it is available on the controller as $ctrl.fn()
function makeMemberExpression (name, fn) {
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

function insertConditionalLogic (fnSource, checks) {
  const checkFns = checks.reduce((memo, check) => {
    const fn = operators[check.exp.operator]
    if (!fn) {
      return memo
    }

    const operands = check.exp.operands
    if (operands.length === 2 &&
        operands[0].operator === 'formElement.value' &&
        typeof operands[operands.length - 1] === 'string') {
      // todo : different functions may have a different signature. may need to account for that
      const value = operands[operands.length - 1]
      const source = operands[0].operands[0]
      const exp = makeMemberExpression(check.name, fn(source, value))
      memo.push(exp)
    }

    return memo
  }, [])

  return modifySource(fnSource, checkFns)
}

module.exports = insertConditionalLogic
