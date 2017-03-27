'use strict'

function processDefinition (processForm) {
  return (definition) => definition.reduce((memo, form) => {
    const writers = processForm(form)
    if (!writers.length) return memo

    memo[form.name] = writers
    return memo
  }, {})
}

module.exports = processDefinition
