'use strict'

const t = require('transducers-js')
const flatten = require('@blinkmobile/varied-definition').flatten

const getInteractions = require('../../filters/is-interaction.js')
const getSubFormNames = require('../../transforms/to-subform-names.js')

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

  const subformNames = getSubFormNames(definition)

  const result = definition.reduce((memo, form) => {
    const formName = form.default.name

    const interactionNames = (f) => {
      console.log('names', f)
      return f[0] || formName + f[1].action
    }
    const fl = (varName) => flatten(form, varName, flattenOptions)
    const lowerCaseName = (f) => {
      // console.log('lowercase name', f)
      f.interaction = (f.interaction || formName).toLowerCase()
      return f
    }

    const addAngularConfig = (formData) => {
      // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
      formData.controllerName = formData.name.replace(/(_[a-z0-9])/gi, (match) => (match[1] + '').toUpperCase())
      // for use in the html templates
      formData.variation = formData.action[0].toUpperCase() + formData.action.substring(1)
      if (formData.interaction.toLowerCase() === formData.name.toLowerCase()) {
        console.log('subform with no interactions match!')
        formData.interaction = `${formData.interaction}_${formData.action}`
      }

      formData.interaction = formData.interaction.toLowerCase()

      // need to update any subform names to include the variation of this form
      formData._elements.forEach((el) => {
        if (el.type.toLowerCase() === 'subform') {
          el.subForm = `${el.subForm}_${formData.action}`
        }
      })
 console.log(`${formName} toFormControllerConfig`, formData)
      return formData
    }

    const makeControllerRenderers = (formData) => {
      const fileRenderer = jsTemplates[`${formData.action.toLowerCase()}-form-controller.js`] || ((a) => '')
      const result = {
        [formData.interaction]: {
          component: fileRenderer(formData)
        }
      }
      return result
    }

    // make the html templates
    const toFormHTML = (f) => {
      // need to add elements here
      f.elements = elementTransducer(f._elements).join('')
      return { [f.interaction]: formTemplate(f) }
    }

    // base normalisation transform
    let normalisation = t.comp(/*t.filter(getInteractions),*/ t.filter((f) => f[0].toLowerCase() !== 'default'), t.map(interactionNames), t.map(fl), t.map(lowerCaseName), t.map(addAngularConfig))
    // console.log('begin normalisation for ' + form.default.name)
    // console.log(t.transduce(normalisation, Object.assign, {}, form))
    // console.log('end normalisation')
    // js controller transform
    let codeXf = t.comp(normalisation, t.map(makeControllerRenderers))
    let code = t.transduce(codeXf, accum, {}, form)

    // if (Object.keys(code).length === 0 && subformNames.indexOf(formName) > -1) {
    //   console.log('### processing a subform')
    //   normalisation = t.comp(t.filter((f) => {console.log('filter', f); return (f[0] && f[0].toLowerCase() !== 'default') }),  t.map(lowerCaseName))
    //   codeXf = t.comp(normalisation, t.map(toFormControllerConfig))
    //   code = t.transduce(codeXf, accum, {}, form)
    // }

    // html template transform
    const xfHTML = t.comp(normalisation, t.map(toFormHTML))
    const views = t.transduce(xfHTML, Object.assign, {}, form)

    // find out what other modules this form component needs (eg subforms)
    form.default.dependencies = form.default._elements.reduce((memo, el) => {
      if (el.default.type.toLowerCase() === 'subform') {
        memo.push(el.default.subForm)
      }

      return memo
    }, []).join(',')

    memo[formName] = {
      module: jsTemplates['form-module.js'](form.default),
      code,
      views
    }
    return memo
  }, {})

  return result
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
  // return result
}

module.exports = {processForm}
