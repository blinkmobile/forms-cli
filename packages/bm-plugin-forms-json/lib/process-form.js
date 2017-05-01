'use strict'

const lazyWriter = require('@blinkmobile/forms-template-helper').lazyWriteFile

function processForm (form) {
  return lazyWriter(`${form.name}.json`, JSON.stringify(form, null, 2))
}

module.exports = processForm
