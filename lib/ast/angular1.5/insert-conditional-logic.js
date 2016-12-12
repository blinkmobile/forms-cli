'use strict'

const recast = require('recast')
const types = recast.types
const b = types.builders

const operators = {
  'contains': require('../types/operator-contains.js'),
  '!contains': require('../types/operator-not-contains.js'),
  '==': require('../types/binary-expression.js')('=='),
  '!=': require('../types/binary-expression.js')('!='),
  '>': require('../types/binary-expression.js')('>'),
  '>=': require('../types/binary-expression.js')('>='),
  '<': require('../types/binary-expression.js')('<'),
  '<=': require('../types/binary-expression.js')('<='),
  'and': require('../types/operator-and.js')
}

function modifySource (fnSource, additions) {
  const targetFn = recast.parse(fnSource)

  types.visit(targetFn, {
    visitFunction: (path) => {
      if (!/Controller$/i.test(path.node.id.name)) {
        // we only insert into controllers
        return
      }
      additions.forEach((fn) => path.get('body', 'body').push(fn))

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

function makeVariableDeclaration (name, fn) {
  return b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      b.identifier(name),
      fn
    )]
  )
}

function isSingleCondition (operands) {
  return operands.length === 2 &&
          operands[0].operator === 'formElement.value' &&
          typeof operands[operands.length - 1] === 'string'
}

function insertConditionalLogic (fnSource, checks) {
  const checkFns = checks.reduce((memo, check) => {
    const fn = operators[check.exp.operator]
    if (!fn) {
      return memo
    }

    const operands = check.exp.operands
    let result
    if (isSingleCondition(operands)) {
      // todo : different functions may have a different signature. may need to account for that
      const value = operands[operands.length - 1]
      const source = operands[0].operands[0]
      result = makeMemberExpression(check.name, fn(source, value))
    } else {
      // multiple conditions that need satisfying.
      const fns = operands.reduce((memo, operand, index) => {
        const fn = operators[operand.operator]
        if (!fn) {
          return memo
        }

        const value = operand.operands[operand.operands.length - 1]
        const source = operand.operands[0].operands[0]
        // todo : different functions may have a different signature. may need to account for that
        const comp = makeVariableDeclaration('check' + index, fn(source, value))
        memo.push(comp)

        return memo
      }, [])

      result = result || makeMemberExpression(check.name, fn(...fns))
    }

    memo.push(result)

    return memo
  }, [])

  return modifySource(fnSource, checkFns)
}

module.exports = insertConditionalLogic
