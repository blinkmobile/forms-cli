'use strict'

const processForm = require('./lib/process-form.js')

module.exports = {
  build: () => Promise.resolve(),
  init: () => Promise.resolve(),
  processForm,
  writeTemplates: (dest) => Promise.resolve()
}
