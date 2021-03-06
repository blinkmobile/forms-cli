'use strict'

const toAngularName = require('./to-angular-name.js')

function angularise (formData) {
  // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
  formData.moduleName = toAngularName(formData.name)
  formData._elements.forEach((el) => {
    if (el.type.toLowerCase() === 'subform') {
      el.subFormElement = el.subForm.replace(/_/g, '-')
    }
  })

  return formData
}

module.exports = angularise
