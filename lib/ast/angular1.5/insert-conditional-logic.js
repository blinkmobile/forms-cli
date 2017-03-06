'use strict'

const logger = require('../../logger.js').logger

const insertIntoController = require('./insert-into-controller.js')
const thisMemberExpression = require('../types/this-member-expression.js')
const variableDeclaration = require('../types/variable-declaration.js')

// these operator keys match the value in the definition sent by BMP
const operators = {
  'contains': require('../types/operator-contains.js'),
  '!contains': require('../types/operator-not-contains.js'),
  '==': require('../types/binary-expression.js')('=='),
  '!=': require('../types/binary-expression.js')('!='),
  '>': require('../types/binary-expression.js')('>'),
  '>=': require('../types/binary-expression.js')('>='),
  '<': require('../types/binary-expression.js')('<'),
  '<=': require('../types/binary-expression.js')('<='),
  'and': require('../types/multiple-logical-expressions.js')('&&'),
  'or': require('../types/multiple-logical-expressions.js')('||')
}

function isSingleCondition (operands) {
  return operands.length === 2 &&
          operands[0].operator === 'formElement.value' &&
          typeof operands[operands.length - 1] === 'string'
}

function insertConditionalLogic (fnSource, checks) {
  const checkFns = checks.reduce((memo, check) => {
    logger.debug(`====================== start insert of check # ${check.name}`)
    logger.debug(JSON.stringify(check))
    logger.debug(`====================== end insert of check # ${check.name}`)
    const fn = operators[check.exp.operator]
    if (!fn) {
      return memo
    }
    const operands = check.exp.operands
    let result

    if (isSingleCondition(operands)) {
      // there is only one check here, so just make it a function on the controller
      const value = operands[operands.length - 1]
      const source = operands[0].operands[0]
      result = thisMemberExpression(check.name, fn(source, value))
    } else {
      // multiple conditions that need satisfying.
      const fns = operands.reduce((memo, operand, index) => {
        const fn = operators[operand.operator]
        if (!fn) {
          return memo
        }

        const value = operand.operands[operand.operands.length - 1]
        const source = operand.operands[0].operands[0]
        const comp = variableDeclaration('check' + index, fn(source, value))
        memo.push(comp)

        return memo
      }, [])

      result = thisMemberExpression(check.name, fn(...fns))
    }

    memo.push(result)

    return memo
  }, [])

  return insertIntoController(fnSource, (path) => {
    checkFns.forEach((fn) => path.get('body', 'body').push(fn))
  })
}

module.exports = insertConditionalLogic
