'use strict'

const path = require('path')

const Template = require('./template.js')
const TemplateStore = require('./template-store.js')
const fileHelper = require('./file-list-helper.js')

function makeTemplateStore (templatePath) {
  const templateStore = new TemplateStore()

  return fileHelper.getFileList(`${templatePath}/**.mustache`)
    .then((defaultTemplates) => {
      defaultTemplates.forEach((p) => templateStore.add(new Template(p)))
    })
    .then(() => fileHelper.getFolderList(`${templatePath}/**/`))
    .then((formList) => {
      // glob will return the name of the template root, which we will store as 'default'
      formList.shift()
      return formList
    })
    .then((formList) => formList.reduce((memo, f) => {
      const formName = path.basename(f)

      memo[formName] = `${f}*.mustache`
      return memo
    }, {}))
    .then((forms) => {
      const formNames = Object.keys(forms)
      return Promise.all(formNames.map((formName) => fileHelper.getFileList(forms[formName])))
        .then((formTemplatePaths) => formNames.forEach(
          (formName, idx) => formTemplatePaths[idx].forEach(
            (p) => templateStore.add(new Template(p), formName)
          ))
        )
    }).then(() => templateStore)
}

module.exports = makeTemplateStore
