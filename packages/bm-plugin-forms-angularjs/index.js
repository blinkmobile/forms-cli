'use strict'

const path = require('path')

const build = require('./lib/build/build.js')
const processForm = require('./lib/transform/process-form.js')
const templateHelper = require('@blinkmobile/forms-template-helper')
const writeTemplates = templateHelper.writeTemplates

module.exports = {
  init: (cfg) => writeTemplates(path.join(__dirname, 'templates'), cfg.distPath),
  create: (cfg, formDefinitions) => Promise.all(formDefinitions.map((formDefinition) => processForm(cfg, formDefinition))),
  build: (cfg) => build(cfg)
}
