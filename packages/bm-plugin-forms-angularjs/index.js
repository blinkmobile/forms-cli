'use strict'

const processForm = require('./lib/transform/process-form.js')
const templateService = require('@blinkmobile/forms-template-helper').service

function init (cfg) {
  return templateService.load(cfg.templatePath)
}

module.exports = {
  processForm,
  init
}
