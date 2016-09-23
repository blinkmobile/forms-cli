'use strict'

const t = require('transducers-js')

const getInteractions = t.filter(require('../../filters/is-interaction.js'))
const flatten = require('../../transforms/flatten-definition.js')

const accum = require('../../accumulators/object-accum.js')

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

    // ************************************************
    // Make the HTML For each form with an interaction
    const toFormElement = t.map((formType) => {
      const formTypeName = formType[0]
      const formTypeData = formType[1]

      if (formTypeData.interaction) {
        formTypeData.interaction = formTypeData.interaction.toLowerCase()
      }

      formTypeData.elements = elementTransducer(formTypeName, elements, formTypeData._elements).join('')
      formTypeData.header = formTypeData.header || header
      formTypeData.footer = formTypeData.footer || footer
      return { [formTypeData.interaction]: formTemplate(formTypeData) }
    })
    const formHTMLXf = t.comp(getInteractions, toFormElement)
    const formHTML = t.transduce(formHTMLXf, Object.assign, {}, form)

    // ***********************************
    // make the controller config
    const toFormControllerConfig = t.map((formType, idx) => {
      const variation = formType[0]
      const variationData = flatten(variation)(form)

      // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
      variationData.controllerName = variationData.name.replace(/(_[a-z])/gi, (match) => match[1].toUpperCase())
      variationData.variation = variation[0].toUpperCase() + variation.substring(1)
      const interactionName = (variationData.interaction || 'subform')
      const fileRenderer = jsTemplates[`${variation}-form-controller.js`] || ((a) => '')

      return {
        [interactionName]: {
          component: fileRenderer(variationData)
        }
      }
    })

    const controllers = t.transduce(toFormControllerConfig, accum, {}, form)

    memo[formName] = {
      module: jsTemplates['form-module.js'](form.default),
      code: controllers,
      views: formHTML
    }

    return memo
  }, {})
 // console.log('result = ', JSON.stringify(result))
  return result
}

module.exports = {processForm}
