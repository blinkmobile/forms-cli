'use strict'

const log = require('../logger.js').logger

function processDefinition (processForm) {
  return (definition) => definition.reduce((memo, form) => {
    log.debug('start process form definition')
    log.debug(form)
    const writers = processForm(form)
    if (!writers.length) return memo

    memo[form.name] = writers
    return memo
  }, {})
}

module.exports = processDefinition
