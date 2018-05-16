'use strict'

const path = require('path')

const build = require('./lib/build/build.js')
const processForm = require('./lib/transform/process-form.js')
const templateHelper = require('@blinkmobile/forms-template-helper')
const templateService = templateHelper.service
const writeTemplates = templateHelper.writeTemplates

module.exports = {
  build,
  init: (cfg) => templateService.load(cfg.templatePath),
  processForm,
  writeTemplates: (dest) => writeTemplates(path.join(__dirname, 'templates'), dest),
  name: 'AngularJS plugin'
}
