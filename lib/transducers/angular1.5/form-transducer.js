'use strict'

const path = require('path')

const t = require('transducers-js')
const log = require('../../logger.js').logger

const lazyWriter = require('./../../utils/write-file-contents.js').lazyWriter
const templateService = require('./../../utils/template-service.js')

const elementTransducer = require('./element-HTML-transducer.js')
const arrAccum = require('../../accumulators/array-accum.js')

const insertConditionalLogic = require('../../ast/angular1.5/insert-conditional-logic.js')
const insertSignatureLogic = require('../../ast/angular1.5/insert-signature-logic.js')

const defaultTypeValues = require('../../angularjs-default-field-types.json')
const COMPONENT_PATH = 'components'

const toAngularName = (str) => str[0].toLowerCase() + str.substr(1).replace(/(_[a-z0-9])/gi, (match) => (match[1] + '').toUpperCase())

const serviceFieldTypes = (el) => {
  el.value = el.value || defaultTypeValues[el.type]
  return el
}

function processForm (definition) {
  const jsTemplates = templateService.getByType('js')
  const formTemplate = templateService.getByType('html').form

  log.info('Converting Form definition to AngularJS Component')
  log.debug('---------- AngularJS Transformer: start definition:')
  log.debug(JSON.stringify(definition))
  log.debug('---------- AngularJS Transformer: end definition:')

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
      let fn = template(formData)

      if (formData._checks.length) {
        fn = insertConditionalLogic(fn, formData._checks)
      }

      const drawElements = formData._elements.filter((el) => el.type.toLowerCase() === 'draw')
      if (drawElements.length) {
        fn = insertSignatureLogic(fn, drawElements)
      }

      return lazyWriter(componentPath, fn)
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
      let type = null
      switch (el.type.toLowerCase()) {
        case 'subform':
          type = toAngularName(el.subForm)
          break
        case 'draw':
          type = 'bmSignaturePad'
          break
        case 'camera':
          type = 'bmCamera'
          break
        case 'location':
          type = 'bmLocation'
          break
      }

      if (type) {
        memo.push(type)
      }

      return memo
    }, [])

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
