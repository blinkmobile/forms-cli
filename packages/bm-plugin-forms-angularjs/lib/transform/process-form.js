'use strict'

const path = require('path')

const t = require('transducers-js')
const templateService = require('@blinkmobile/forms-template-helper').service
const lazyWriter = require('@blinkmobile/forms-template-helper').lazyWriteFile

// const elementTransducer = require('./element-HTML-transformer.js')
const serviceFieldTypes = require('./set-default-value.js')
const angularise = require('./angularise-definition.js')
const toAngularName = require('./to-angular-name.js')

const makeControllerRenderer = require('../renderers/controller-renderer.js')
const makeModelServiceRenderer = require('../renderers/model-service-renderer.js')
const makeHTMLRenderers = require('../renderers/html-renderer.js')

const COMPONENT_PATH = 'components'

const arrAccum = (memo, val) => {
  memo.push(val)
  return memo
}

function processForm (form) {
  const jsTemplates = templateService.getByType('js')
  const formWriters = []
  const formName = form.name
  const pages = form._elements.reduce((memo, el) => {
    if (memo.indexOf(el.page) > -1) {
      return memo
    }

    memo.push(el.page)
    return memo
  }, [])

  if (pages.length > 1) {
    form.pageNumbers = `[${pages.join(', ')}]`
  }

  form.bmFormsPage = 0

  // form module
  const moduleOptions = Object.assign({}, angularise(form))
  moduleOptions.subForms = form._elements.reduce((memo, el) => {
    if (el.type.toLowerCase() === 'subform') {
      memo.push(toAngularName(el.subForm))
    }

    return memo
  }, [])

  if (moduleOptions.subForms.length) {
    moduleOptions.subFormModelServices = moduleOptions.subForms.join('Model, ') + 'Model'
    moduleOptions.subFormDependencyList = `'${moduleOptions.subForms.join('Model\', \'')}Model'`
  }

  moduleOptions.moduleDependencies = form._elements.reduce((memo, el) => {
    let type = null
    switch (el.type.toLowerCase()) {
      case 'subform':
        type = toAngularName(el.subForm)
        el.subForm = type
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

    if (type && memo.indexOf(type) === -1) {
      memo.push(type)
    }
    el.moduleName = moduleOptions.moduleName
    return memo
  }, [])

  if (moduleOptions.moduleDependencies.length) {
    moduleOptions.dependencyString = `'${moduleOptions.moduleDependencies.join('\', \'')}'`
  }
  // add the angular module to the output
  formWriters.push(lazyWriter(`${formName}-module.js`, jsTemplates['form-module.js'](moduleOptions)))

  // add the model service to the output
  moduleOptions._elements = t.transduce(t.map(serviceFieldTypes), arrAccum, [], form._elements)
  formWriters.push(lazyWriter(`${formName}-model-service.js`, makeModelServiceRenderer(moduleOptions)))

  // js controller transform
  const formControllerName = path.join(COMPONENT_PATH, `component-${form.name}.js`)
  formWriters.push(lazyWriter(formControllerName,
    makeControllerRenderer({
      form: moduleOptions,
      pages: pages.length > 1
    })))

  // submit to bmp service
  formWriters.push(lazyWriter('form-submit-to-bmp-service.js', jsTemplates['form-submit-to-bmp-service.js'](moduleOptions)))

  // // html template transform
  const formHTMLname = path.join(COMPONENT_PATH, `component-${form.name}.html`)
  formWriters.push(lazyWriter(formHTMLname, makeHTMLRenderers({form: moduleOptions, pages})))

  return formWriters
}

module.exports = processForm
