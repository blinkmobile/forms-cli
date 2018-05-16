'use strict'

const path = require('path')

function writeSite (basePath, formData) {
  const formNames = Object.keys(formData)

  return Promise.all(formNames.map((formName) => {
    console.log('writing Form: ' + formName)
    let form = formData[formName]
    if (!form) {
      return Promise.resolve()
    }

    if (!Array.isArray(form) && typeof form !== 'function') {
      console.log('Form is not a function or an Array of functions')
      return Promise.reject(new Error('Form must be a single function or an Array of functions'))
    }

    if (typeof form === 'function') {
      form = [form]
    }
    const formPath = path.join(basePath, formName)
    console.log(`Writing form to ${formPath}`)
    return Promise.all(form.map((writer) => writer(formPath)))
  }))
}

module.exports = {writeSite}
