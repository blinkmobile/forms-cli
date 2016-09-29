'use strict'

const t = require('transducers-js')
const flatten = require('@blinkmobile/varied-definition').flatten

const getInteractions = t.filter(require('../../filters/is-interaction.js'))
// const flatten = require('../../transforms/flatten-definition.js')
const isSubformElement = require('../../filters/element-is-subform.js')
const inForm = require('../../filters/element-in-form.js')

const accum = require('../../accumulators/object-accum.js')

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

function processForm (options) {
  const definition = options.definition
  const elementTransducer = options.elementTransducer
  const jsTemplates = options.jsTemplates
  const formTemplate = options.formTemplate

  const result = definition.reduce((memo, form) => {
    // const elements = form.default._elements
    // const header = form.default.header
    // const footer = form.default.footer
    const formName = form.default.name

    const interactionNames = (f) => f[0]
    const fl = (varName) => {
      const r = flatten(form, varName, flattenOptions)
      // console.log('r=', r)
      // console.log('d=', form[varName])

      return r
    }

    const lowerCaseName = (f) => {
      f.interaction = f.interaction.toLowerCase()
      return f
    }

    const toFormControllerConfig = (formData) => {
      // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
      formData.controllerName = formData.name.replace(/(_[a-z])/gi, (match) => match[1].toUpperCase())
      formData.variation = formData.action[0].toUpperCase() + formData.action.substring(1)
      formData.interaction = (formData.interaction || 'subform').toLowerCase()
      const fileRenderer = jsTemplates[`${formData.action.toLowerCase()}-form-controller.js`] || ((a) => '')
      const result = {
        [formData.interaction]: {
          component: fileRenderer(formData)
        }
      }
// console.log('result = ', result)
      return result
    }

    // make the html templates
    const toFormHTML = (f) => {
      // need to add elements here
      f.elements = elementTransducer(f._elements).join('')
      return { [f.interaction]: formTemplate(f) }
    }

    // base normalisation transform
    const normalisation = t.comp(getInteractions, t.map(interactionNames), t.map(fl), t.map(lowerCaseName))
    // js controller transform
    const codeXf = t.comp(normalisation, t.map(toFormControllerConfig))
    // console.log('result=', result)
    // html template transform
    const xfHTML = t.comp(normalisation, t.map(toFormHTML))

    // find out what other modules this form component needs (eg subforms)
    form.default.dependencies = form.default._elements.reduce((memo, el) => {
      console.log('el=', el)
      if (el.default.type.toLowerCase() === 'subform') {
        memo.push(el.default.name)
      }

      return memo
    }, []).join(',')
console.log('dependencies=', form.default.dependencies)
    memo[formName] = {
      module: jsTemplates['form-module.js'](form.default),
      code: t.transduce(codeXf, accum, {}, form),
      views: t.transduce(xfHTML, Object.assign, {}, form)
    }
    return memo
  }, {})

  // loop through each form in a definition running the
  // transduers on the data
//   const result = definition.reduce((memo, form) => {
//     // grab what we need to pass down into the form element transducer
// console.log('## working on form:', form)
//     const elements = form.default._elements
//     const header = form.default.header
//     const footer = form.default.footer
//     const formName = form.default.name

//     // ************************************************
//     // Make the HTML For each form with an interaction
//     const toFormElement = t.map((formType) => {
//       const formTypeName = formType[0]
//       const formTypeData = formType[1]

//       if (formTypeData.interaction) {
//         formTypeData.interaction = formTypeData.interaction.toLowerCase()
//       }

//       formTypeData.elements = elementTransducer(formTypeName, elements, formTypeData._elements).join('')
//       formTypeData.header = formTypeData.header || header
//       formTypeData.footer = formTypeData.footer || footer
//       return { [formTypeData.interaction]: formTemplate(formTypeData) }
//     })
//     const formHTMLXf = t.comp(getInteractions, toFormElement)
//     const formHTML = t.transduce(formHTMLXf, Object.assign, {}, form)

//     // ***********************************
//     // make the controller config
//     const toFormControllerConfig = t.map((formType, idx) => {
//       const variation = formType[0]
//       const variationData = flatten(variation, true)(form.default)

//       const subformXF = t.comp(t.filter(inForm(variationData._elements, true)), t.filter(isSubformElement))
// console.log('####### about to check for subforms in ', variationData.name + ' ' + variation, variationData)
//       variationData.subForms = t.into([], subformXF, elements)
// console.log('subforms: ', (variationData.subForms || []).join(', '))
// console.log('####### end check for subforms')
//       // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
//       variationData.controllerName = variationData.name.replace(/(_[a-z])/gi, (match) => match[1].toUpperCase())
//       variationData.variation = variation[0].toUpperCase() + variation.substring(1)
//       const interactionName = (variationData.interaction || 'subform')
//       const fileRenderer = jsTemplates[`${variation}-form-controller.js`] || ((a) => '')

//       return {
//         [interactionName]: {
//           component: fileRenderer(variationData)
//         }
//       }
//     })
//     const formXf = t.comp(t.filter(getInteractions), toFormControllerConfig)
//     const controllers = t.transduce(formXf, accum, {}, form)

//     memo[formName] = {
//       module: jsTemplates['form-module.js'](form.default),
//       code: controllers,
//       views: formHTML
//     }

//     return memo
//   }, {})
 // console.log('result = ', JSON.stringify(result))
  return result
}

module.exports = {processForm}
