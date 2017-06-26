'use strict'

const debugLogger = require('../logger/loggers.js').debugLogger

function processDefinition (processForm) {
  return (definition) => definition.reduce((memo, form) => {
    debugLogger.debug('start framework processing of form definition')
    debugLogger.debug('input')
    debugLogger.debug(JSON.stringify(form))

    let writers = processForm(form)
    if (!Array.isArray(writers)) {
      writers = [writers]
    }

    memo[form.name] = writers
    return memo
  }, {})
}

module.exports = processDefinition
