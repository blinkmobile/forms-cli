'use strict'

const t = require('transducers-js')
const flatten = require('@blinkmobile/varied-definition').flatten

// const getSubFormNames = require('../../transforms/to-subform-names.js')

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

  // const subformNames = getSubFormNames(definition)

  const result = definition.reduce((memo, form) => {
    const formName = form.default.name

    const interactionNames = (f) => (f[0] || formName + f[1].action)
    const fl = (varName) => flatten(form, varName, flattenOptions)
    const lowerCaseName = (f) => {
      f.interaction = (f.interaction || formName).toLowerCase()
      return f
    }

    const addAngularConfig = (formData) => {
      // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
      formData.controllerName = formData.name[0].toLowerCase() + formData.name.substr(1).replace(/(_[a-z0-9])/gi, (match) => (match[1] + '').toUpperCase())
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
      f.elements = elementTransducer(f._elements).join('')
      return { [f.interaction]: formTemplate(f) }
    }

    // base normalisation transform
    let normalisation = t.comp(t.filter((f) => f[0].toLowerCase() !== 'default'), t.map(interactionNames), t.map(fl), t.map(lowerCaseName), t.map(addAngularConfig))
    // js controller transform
    let codeXf = t.comp(normalisation, t.map(makeControllerRenderers))
    let code = t.transduce(codeXf, accum, {}, form)

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

    let dependencyArr = form.default.dependencies.replace(' ', '').split(',')
    console.log('length = ' + dependencyArr.length)
    dependencyArr = dependencyArr.reduce((memo, dep) => {
      if(dep) {
        memo = memo || []
        memo.push(dep)
      }

      return memo
    }, null)

    memo[formName] = {
      module: jsTemplates['form-module.js'](form.default),
      dependencies: dependencyArr,
      code,
      views
    }
    return memo
  }, {})

  return result
}

module.exports = {processForm}
