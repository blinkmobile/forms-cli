'use strict'

const path = require('path')

const writeFileContents = require('./utils/write-file-contents.js').writeFileContents

const logError = (err) => console.log(err)

function writeSite (basePath, formData, indexTemplate) {
  const formNames = Object.keys(formData)
  const scriptNames = []

  formNames.forEach((formName) => {
    const form = formData[formName]
    if (!form) {
      return
    }
console.log('writing form data:')
console.log(JSON.stringify(form))
    const formPath = path.join(basePath, formName)
console.log(`form path = ${formPath}`)
    const relPath = path.relative.bind(path, formPath)

    // form component module
    const module = form.module
    const moduleName = path.join(formPath, `${formName}-module.js`)
    scriptNames.push(relPath(moduleName))
    writeFileContents(moduleName, module)

    // forms
    const formNames = Object.keys(form.code)
    const viewNames = Object.keys(form.views)
    let componentNames = []
    Promise.all(formNames.map((component) => {
      // componentNames.push(component.replace(/_/g, '-'))
      // const componentPath = path.join(formPath, 'components', `component-${component}.js`)
      const p = path.join(formPath, form.code[component].component.path)
      scriptNames.push(relPath(p))
      componentNames.push(form.code[component].component.name)
      return writeFileContents(p, form.code[component].component.template).catch(logError)
    }).concat(viewNames.map((name) => {
      const p = path.join(formPath, 'templates', `${name}.html`)
      return writeFileContents(p, form.views[name]).catch(logError)
    })))

    // Promise.all(viewNames.map((name) => {
    //   const p = path.join(formPath, 'templates', `${name}.html`)
    //   console.log(`writing template ${name} to  ${p}`)
    //   return writeFileContents(p, form.views[name]).catch(logError)
    // }))

    // write services for this form
    Object.keys(form.services).forEach((serviceName) => {
      console.log(`writing service ${serviceName} to ${form.services[serviceName].filename}`)
      writeFileContents(path.join(formPath, form.services[serviceName].filename), form.services[serviceName].template)
    })

    // now write the index.html parts
    const indexData = {scriptNames, componentNames, form}
    console.log('writing index with ', JSON.stringify(indexData))
    writeFileContents(path.join(formPath, 'index.html'), indexTemplate(indexData))

    // reset script names for next module
    scriptNames.length = 0
  })

  return formData
}

module.exports = {writeSite}
