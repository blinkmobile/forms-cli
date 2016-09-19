'use strict'

const t = require('transducers-js')

const getInteractions = t.filter(require('./lib/filters/is-interaction.js'))
const flatten = require('./lib/transforms/flatten-definition.js')

function processForm (options) {
  const definition = options.definition
  const elementTransducer = options.elementTransducer
  const jsTemplates = options.jsTemplates
  const formTemplate = options.formTemplate

  // loop through each form in a definition running the
  // transduers on the data
  const result = definition.reduce((memo, form) => {
    // grab what we need to pass down into the form element transducer
    const elements = form.default._elements
    const header = form.default.header
    const footer = form.default.footer
    const formName = form.default.name

    // Make the HTML For each form with an interaction
    const toFormElement = t.map((formType) => {
      const formTypeName = formType[0]
      const formTypeData = formType[1]
      formTypeData.elements = elementTransducer(formTypeName, elements, formTypeData._elements).join('')
      formTypeData.header = formTypeData.header || header
      formTypeData.footer = formTypeData.footer || footer
      return { [formTypeData.interaction.toLowerCase()]: formTemplate(formTypeData) }
    })
    const formHTMLXf = t.comp(getInteractions, toFormElement)
    const formHTML = t.transduce(formHTMLXf, Object.assign, {}, form)
  console.log('formTypeData', formHTML)

    // make the controller config
    const toFormControllerConfig = t.map((formType, idx) => {
      const formTypeName = formType[0]
      const formTypeData = flatten(formTypeName)(form)
      formTypeData.variation = formTypeName
      // formTypeData.templatePath = formHTML
      const interactionName = (formTypeData.interaction || 'subform').toLowerCase()
      // const controllerName = interactionName + '-controller'
      const fileRenderer = jsTemplates[`${formTypeName}-form-controller.js`]

      return {[interactionName]: fileRenderer && fileRenderer(formTypeData) || ''}
    })

    const accum = (memo, item) => Object.assign(memo, item)
    // const formControllerXf = t.comp(getInteractions, toFormControllerConfig)
    const controllers = t.transduce(toFormControllerConfig, accum, {}, form)

    // make the module file
    const moduleTemplate = jsTemplates['form-module.js']

    memo[formName] = {
      module: moduleTemplate(form.default),
      controllers,
      views: formHTML
    }

    return memo
  }, {})
 console.log('result = ', result)
  return result
}

module.exports = {processForm}
