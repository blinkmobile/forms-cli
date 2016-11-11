'use strict'

const path = require('path')

const t = require('transducers-js')

const getTemplatePaths = require('./get-template-paths.js').getTemplatePaths
const createRendererFn = require('./template-helper.js').createRenderer

const templates = {}

const makeRendererDetails = t.map((templatePath) => Promise.all([
  Promise.resolve(path.basename(templatePath, path.extname(templatePath))),
  createRendererFn(templatePath)
]))

function loadTemplate (templateType, templatePath) {
  templates[templateType] = templates[templateType] || {}
  return getTemplatePaths(templatePath)
    .then((files) => Promise.all(t.into([], makeRendererDetails, files)))
    .then((templateRenderers) => t.into(templates[templateType], t.identity, templateRenderers))
    .catch((err) => console.log('Error making template renderer: ', err))
}

function loadAllTemplates (templateMap) {
  return Promise.all(Object.keys(templateMap).map((key) => loadTemplate(key, templateMap[key])))
}

module.exports = {
  load: (templateMap) => loadAllTemplates(templateMap).then(() => templates),
  getByType: (type) => templates[type]
}
