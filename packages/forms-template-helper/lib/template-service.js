'use strict'

const path = require('path')

const t = require('transducers-js')

const fileHelper = require('./file-list-helper.js')
const createRendererFn = require('./renderer-mustache.js').createRenderer

const templates = {}

const makeRendererDetails = t.map((templatePath) => Promise.all([
  Promise.resolve(path.basename(templatePath, path.extname(templatePath))),
  createRendererFn(templatePath)
]))

function loadTemplate (templateType, templatePath) {
  templates[templateType] = templates[templateType] || {}
  return fileHelper.getFileList(templatePath)
    .then((files) => Promise.all(t.into([], makeRendererDetails, files)))
    .then((templateRenderers) => t.into(templates[templateType], t.identity, templateRenderers))
}

function loadAllTemplates (templateMap) {
  return Promise.all(Object.keys(templateMap).map((key) => loadTemplate(key, templateMap[key])))
}

function makeTemplateHash (templatePath) {
  return fileHelper.getFolderList(`${templatePath}/**/`).then((folders) => {
    const hash = {}
    const regex = new RegExp(`^\/?${templatePath}\/?$`, 'i') // eslint-disable-line no-useless-escape
    folders.forEach((folder) => {
      regex.lastIndex = 0
      if (!regex.test(folder)) {
        const type = path.basename(folder)
        hash[type] = `${folder}**.mustache`
      }
    })

    return hash
  })
}

module.exports = {
  load: (templatePath) => makeTemplateHash(templatePath).then(loadAllTemplates).then(() => templates),
  getByType: (type) => templates[type]
}
