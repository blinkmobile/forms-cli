'use strict'

const path = require('path')

const t = require('transducers-js')

const lazyWriter = require('./../../utils/write-file-contents.js').lazyWriter
const templateService = require('./../../utils/template-service.js')

const elementTransducer = require('./element-HTML-transducer.js')
const arrAccum = require('../../accumulators/array-accum.js')
// const writeFileContents = require('./../../utils/write-file-contents.js').writeFileContents

const defaultTypeValues = require('../../default-field-types.json')
const COMPONENT_PATH = 'components'

const toAngularName = (str) => str[0].toLowerCase() + str.substr(1).replace(/(_[a-z0-9])/gi, (match) => (match[1] + '').toUpperCase())

const serviceFieldTypes = (el) => {
  el.value = defaultTypeValues[el.type]
  return el
}

function processForm (definition) {
  const jsTemplates = templateService.getByType('scriptTemplates')
  const formTemplate = templateService.getByType('viewTemplates').form

  return definition.reduce((memo, form) => {
    const formWriters = []
    const formName = form.name

    const addAngularConfig = (formData) => {
      // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
      formData.moduleName = toAngularName(formData.name)
      formData._elements.forEach((el) => {
        if (el.type.toLowerCase() === 'subform') {
          el.subFormElement = el.subForm.replace('_', '-')
        }
      })

      return formData
    }

    const makeControllerRenderers = (formData) => {
      const componentPath = path.join(COMPONENT_PATH, `component-${formName}.js`)
      const template = jsTemplates['form-controller.js']

      return lazyWriter(componentPath, template(formData))
    }

    // make the html templates
    const makeHTMLRenderers = (formData) => {
      const componentPath = path.join(COMPONENT_PATH, `component-${formName}.html`)
      formData.elements = elementTransducer(formData._elements).join('')

      return lazyWriter(componentPath, formTemplate(formData))
    }

    // form module
    const moduleOptions = Object.assign({}, addAngularConfig(form))

    // moduleOptions.moduleName = toAngularName(moduleOptions.name)
    moduleOptions.moduleDependencies = form._elements.reduce((memo, el) => {
      if (el.type.toLowerCase() === 'subform') {
        memo.push(toAngularName(el.subForm))
      }

      return memo
    }, []).join(',')

    // add the angular module to the output
    formWriters.push(lazyWriter(`${formName}-module.js`, jsTemplates['form-module.js'](moduleOptions)))

    // add the model service to the output
    moduleOptions._elements = t.transduce(t.map(serviceFieldTypes), arrAccum, [], form._elements)
    formWriters.push(lazyWriter(`${formName}-model-service.js`, jsTemplates['model-service.js'](moduleOptions)))

    // js controller transform
    formWriters.push(makeControllerRenderers(moduleOptions))
    // // html template transform
    formWriters.push(makeHTMLRenderers(moduleOptions))
    memo[formName] = formWriters

    return memo
  }, {})
}

module.exports = {processForm}
