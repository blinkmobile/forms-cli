'use strict'

const debugLogger = require('../logger/loggers.js').debugLogger

function processDefinition (processForm) {
  return (definition) => definition.reduce((memo, form) => {
    debugLogger.debug('start framework processing of form definition')

    const writers = processForm(form)
    if (!writers.length) return memo

    memo[form.name] = writers
    return memo
  }, {})
}

module.exports = processDefinition
