'use strict'

const path = require('path')

const writeFileContents = require('./utils/write-file-contents.js').writeFileContents

const logError = (err) => console.log(err)

function writeSite (basePath, formData) {
  const formNames = Object.keys(formData)
  formNames.forEach((formName) => {
    const form = formData[formName]
    if (!form) {
      return
    }

    // form component module
    const module = form.module
    writeFileContents(path.join(basePath, formName, `${formName}-module.js`), module)

    // forms
    const formNames = Object.keys(form.code)
    formNames.forEach((component) => writeFileContents(path.join(basePath, formName, 'components', `component-${component}.js`), form.code[component].component).catch(logError))

    // resources ??? do we really need these ?
    // writeFileContents(path.join(basePath, formName, 'js', `resource-${formName}.js`), form.resource).catch(logError)

    const viewNames = Object.keys(form.views)
    viewNames.forEach((name) => writeFileContents(path.join(basePath, formName, 'templates', `${name}.html`), form.views[name]).catch(logError))
  })

  return formData
}

module.exports = {writeSite}
