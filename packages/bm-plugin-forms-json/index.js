'use strict'

const processForm = require('./lib/process-form.js')

module.exports = {
  build: () => Promise.resolve(),
  init: () => Promise.resolve(),
  processForm,
  writeTemplates: (dest) => Promise.reject(new Error('No Templates needed for JSON files'))
}
