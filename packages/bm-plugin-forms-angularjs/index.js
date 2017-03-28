'use strict'

const path = require('path')

const processForm = require('./lib/transform/process-form.js')
const templateHelper = require('@blinkmobile/forms-template-helper')
const templateService = templateHelper.service
const writeTemplates = templateHelper.writeTemplates

module.exports = {
  processForm,
  init: (cfg) => templateService.load(cfg.templatePath),
  writeTemplates: (dest) => writeTemplates(path.join(__dirname, 'templates'), dest)
}
