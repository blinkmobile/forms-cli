'use strict'

const path = require('path')
const EventEmitter = require('events')

const t = require('transducers-js')

const writeFileContents = require('./../../utils/write-file-contents.js').writeFileContents
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
    const formName = form.default.name
    const interactionNames = (f) => (f[0] || formName + f[1].action)
    const fl = (varName) => flatten(form, varName, flattenOptions)

    const lowerCaseName = (f) => {
      f.interaction = (f.interaction || formName).toLowerCase()
      return f
    }

    const addAngularConfig = (formData) => {
      // satisfy angulars naming conventions (no underscores, must be camelCase, must start with a lower case letter)
      formData.moduleName = toAngularName(formData.name) // formData.name[0].toLowerCase() + formData.name.substr(1).replace(/(_[a-z0-9])/gi, (match) => (match[1] + '').toUpperCase())
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
      const result = {
        [formData.interaction]: {
          name: formData.interaction,
          path: componentPath,
          render: () => jsTemplates[`${formData.action.toLowerCase()}-form-controller.js`](formData)
        }
      }

      return result
    }

    // make the html templates
    const makeHTMLRenderers = (formData) => {
      formData.elements = elementTransducer(formData._elements).join('')

      return {
        [formData.interaction]: {
          path: path.join(COMPONENT_PATH, `component-${formData.name}_${formData.action}.html`),
          render: () => formTemplate(formData)
        }
      }
    }

    // base normalisation transform
    const normalisation = t.comp(t.filter((f) => f[0].toLowerCase() !== 'default'), t.map(interactionNames), t.map(fl), t.map(lowerCaseName), t.map(addAngularConfig))
    const moduleOptions = t.transduce(normalisation, arrAccum, [], form)

    // it appears that we need another transformer for
    //  as the normalisation one
    moduleOptions.forEach((formAction) => processingEvents.emit(EVENT_NAMES.EVENT_FORM_NORMALISED, formAction))

// temp for debugging

writeFileContents(`./test/simonspace-${formName}.json`, JSON.stringify(moduleOptions)).catch((err) => console.log(err.message))

    // js controller transform
    const codeXf = t.comp(normalisation, t.map(makeControllerRenderers))
    const code = t.transduce(codeXf, accum, {}, form)

    // html template transform
    const xfHTML = t.comp(normalisation, t.map(makeHTMLRenderers))
    const views = t.transduce(xfHTML, Object.assign, {}, form)

    // find out what other modules this form component needs (eg subforms)
    moduleOptions.dependencies = form.default._elements.reduce((memo, el) => {
      if (el.default.type.toLowerCase() === 'subform') {
        memo.push({filename: el.default.subForm, moduleName: toAngularName(el.default.subForm)})
      }

      return memo
    }, [])

    let dependencyList = moduleOptions.dependencies.reduce((memo, dep) => {
      if (dep) {
        memo = memo || []
        memo.push(dep.moduleName)
      }

      return memo
    }, null)

    if (dependencyList) {
      moduleOptions.moduleDependencies = dependencyList = dependencyList.join(',')
    }

    // make the services that this module will depend on
    const services = {}
    services.modelFactory = {
      template: jsTemplates['model-service.js'](moduleOptions),
      filename: `${formName}-model-service.js`,
      name: `${moduleOptions.moduleName}Model`
    }

    memo[formName] = {
      name: toAngularName(formName),
      module: jsTemplates['form-module.js'](moduleOptions),
      moduleDependencies: dependencyList,
      dependencies: moduleOptions.dependencies,
      services,
      code,
      views
    }
    return memo
  }, {})
}

module.exports = {processForm, processingEvents, EVENT_NAMES}
