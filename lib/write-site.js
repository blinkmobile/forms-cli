'use strict'

const path = require('path')

const writeFileContents = require('./utils/write-file-contents.js').writeFileContents

const logError = (err) => console.log(err)

function writeSite (basePath, formData, indexTemplate) {
  const formNames = Object.keys(formData)

  return Promise.all(formNames.map((formName) => {
    const scriptNames = []
    const form = formData[formName]
    if (!form) {
      return Promise.resolve()
    }

    const formPath = path.join(basePath, formName)
    const relPath = path.relative.bind(path, formPath)

    // form component module
    const module = form.module
    const moduleName = path.join(formPath, `${formName}-module.js`)
    scriptNames.push(relPath(moduleName))
    let componentNames = []

    // forms
    const formNames = Object.keys(form.code)
    const viewNames = Object.keys(form.views)

    const makeComponents = () => {
      return formNames.map((component) => {
        const p = path.join(formPath, form.code[component].component.path)
        scriptNames.push(relPath(p))
        componentNames.push(form.code[component].component.name)
        return writeFileContents(p, form.code[component].component.template)
      })
    }

    const makeViews = () => Promise.all(viewNames.map((name) => writeFileContents(path.join(formPath, 'templates', `${name}.html`), form.views[name])))

    const makeServices = () => Promise.all(
      Object.keys(form.services)
            .map((serviceName) => writeFileContents(path.join(formPath, form.services[serviceName].filename), form.services[serviceName].template))
      )

    return writeFileContents(moduleName, module).then(() => {
      return Promise.all(makeComponents())
      .then(() => makeViews())
      .then(() => makeServices())
      .then(() => {
        // now write the index.html parts
        const indexData = {scriptNames, componentNames, form}
        return writeFileContents(path.join(formPath, 'index.html'), indexTemplate(indexData))
      })
    })
    .then(() => formData)
    .catch(logError)
  }))
}

module.exports = {writeSite}
