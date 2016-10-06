'use strict'

const path = require('path')

const writeFileContents = require('./utils/write-file-contents.js').writeFileContents

const logError = (err) => console.log(err)

function writeSite (basePath, formData, indexTemplate) {
  const formNames = Object.keys(formData)
  const scriptNames = []
console.log('about to write form data')
console.log(formData)
// console.log(JSON.stringify(formData))
  formNames.forEach((formName) => {
    const form = formData[formName]
    if (!form) {
      return
    }

    const formPath = path.join(basePath, formName)
    const relPath = path.relative.bind(path, formPath)

    // form component module
    const module = form.module
    const moduleName = path.join(formPath, `${formName}-module.js`)
    scriptNames.push(relPath(moduleName))
    writeFileContents(moduleName, module)

    // forms
    const formNames = Object.keys(form.code)
    let componentNames = []
    formNames.forEach((component) => {
      // console.log('component')
      // console.log(component)
      componentNames.push(component.replace(/_/g, '-'))
      const componentPath = path.join(formPath, 'components', `component-${component}.js`)
      scriptNames.push(relPath(componentPath))
      writeFileContents(componentPath, form.code[component].component).catch(logError)
    })

    // resources ??? do we really need these ?
    // writeFileContents(path.join(basePath, formName, 'js', `resource-${formName}.js`), form.resource).catch(logError)

    const viewNames = Object.keys(form.views)
    viewNames.forEach((name) => writeFileContents(path.join(formPath, 'templates', `${name}.html`), form.views[name]).catch(logError))

    // now write the index.html parts
    writeFileContents(path.join(formPath, 'index.html'), indexTemplate({scriptNames, componentNames, module: formName, dependencies: form.dependencies}))

    // reset script names for next module
    scriptNames.length = 0
  })

  return formData
}

module.exports = {writeSite}