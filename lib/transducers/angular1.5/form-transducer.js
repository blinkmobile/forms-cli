'use strict'

const path = require('path')
const EventEmitter = require('events')

const t = require('transducers-js')

const lazyWriter = require('./../../utils/write-file-contents.js').lazyWriter
const templateService = require('./../../utils/template-service.js')

const elementTransducer = require('./element-HTML-transducer.js')

const flatten = require('@blinkmobile/varied-definition').flatten
const accum = require('../../accumulators/object-accum.js')
const arrAccum = require('../../accumulators/array-accum.js')

const EVENT_NAMES = {
  EVENT_FORM_NORMALISED: 'normalisation'
}
const COMPONENT_PATH = 'components'

const flattenOptions = {
  nesting: [
    '_elements',
    '_sections',
    '_pages',
    '_behaviours',
    '_checks',
    '_actions'
  ],
  selection: ['_elements']
}

const processingEvents = new EventEmitter()

const toAngularName = (str) => str[0].toLowerCase() + str.substr(1).replace(/(_[a-z0-9])/gi, (match) => (match[1] + '').toUpperCase())

function processForm (definition) {
  const jsTemplates = templateService.getByType('scriptTemplates')
  const formTemplate = templateService.getByType('viewTemplates').form

  return definition.reduce((memo, form) => {
    const formWriters = []
    const formName = form.default.name

    const interactionNames = (f) => (f[0] || formName + f[1].action)
    const fl = (varName) => flatten(form, varName, flattenOptions)

    const lowerCaseName = (f) => {
      f.interaction = (f.interaction || formName).toLowerCase()
      return f
    }

    const addAngularConfig = (formData) => {
      // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
      formData.moduleName = toAngularName(formData.name)
      // for use in the html templates
      formData.variation = formData.action[0].toUpperCase() + formData.action.substring(1)
      if (formData.interaction.toLowerCase() === formData.name.toLowerCase()) {
        formData.interaction = `${formData.interaction}_${formData.action}`
      }

      formData.interaction = formData.interaction.toLowerCase()

      // need to update any subform names to include the variation of this form
      formData._elements.forEach((el) => {
        if (el.type.toLowerCase() === 'subform') {
          el.subForm = `${el.subForm}_${formData.action}`
        }
      })

      return formData
    }

    const makeControllerRenderers = (formData) => {
      const componentPath = path.join(COMPONENT_PATH, `component-${formData.interaction}.js`)
      const template = jsTemplates[`${formData.action.toLowerCase()}-form-controller.js`]

      return lazyWriter(componentPath, template(formData))
    }

    // make the html templates
    const makeHTMLRenderers = (formData) => {
      const componentPath = path.join(COMPONENT_PATH, `component-${formData.name}_${formData.action}.html`)
      formData.elements = elementTransducer(formData._elements).join('')

      return lazyWriter(componentPath, formTemplate(formData))
    }

    // base normalisation transform
    const normalisation = t.comp(t.filter((f) => f[0].toLowerCase() !== 'default'),
      t.map(interactionNames),
      t.map(fl),
      t.map(lowerCaseName),
      t.map(addAngularConfig))

    // form module
    const moduleOptions = t.transduce(normalisation, accum, {}, form)
    moduleOptions.moduleDependencies = form.default._elements.reduce((memo, el) => {
      if (el.default.type.toLowerCase() === 'subform') {
        memo.push(toAngularName(el.default.subForm))
      }

      return memo
    }, []).join(',')

    // add the angular module to the output
    formWriters.push(lazyWriter(`${formName}-module.js`, jsTemplates['form-module.js'](moduleOptions)))

    // add the model service to the output
    formWriters.push(lazyWriter(`${formName}-model-service.js`, jsTemplates['model-service.js'](moduleOptions)))

    // js controller transform
    const codeXf = t.comp(normalisation, t.map(makeControllerRenderers))
    t.transduce(codeXf, arrAccum, formWriters, form)

    // html template transform
    const xfHTML = t.comp(normalisation, t.map(makeHTMLRenderers))
    t.transduce(xfHTML, arrAccum, formWriters, form)

    memo[formName] = formWriters

    return memo
  }, {})
}

module.exports = {processForm, processingEvents, EVENT_NAMES}
