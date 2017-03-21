'use strict'

const path = require('path')

const t = require('transducers-js')

const ElementTransducer = require('./element-HTML-transformer.js')
const serviceFieldTypes = require('./set-default-value.js')
const angularise = require('./angularise-definition.js')
const toAngularName = require('./to-angular-name.js')

// ast related
const insertConditionalLogic = require('../ast/insert-conditional-logic.js')
const insertSignatureLogic = require('../ast/insert-signature-logic.js')
const removeNodeFrom = require('../ast/remove-node-from.js')

const COMPONENT_PATH = 'components'

const arrAccum = (memo, val) => {
  memo.push(val)
  return memo
}

function processForm ({templateService, lazyWriter}) {
  const jsTemplates = templateService.getByType('js')
  const htmlTemplates = templateService.getByType('html')
  const formTemplate = htmlTemplates.form
  const elementTransducer = ElementTransducer(templateService)

  return function toAngularJS (form) {
    const formWriters = []
    const formName = form.name

    const pages = form._elements.reduce((memo, el) => {
      if (memo.indexOf(el.page) > -1) {
        return memo
      }

      memo.push(el.page)
      return memo
    }, [])

    const makeControllerRenderers = (formData) => {
      const componentPath = path.join(COMPONENT_PATH, `component-${formName}.js`)
      const template = jsTemplates['form-controller.js']
      if (pages.length > 1) {
        formData.pageNumbers = `[${pages.join(', ')}]`
      }

      let fn = template(formData)

      if (formData._checks.length) {
        fn = insertConditionalLogic(fn, formData._checks)
      }

      const drawElements = formData._elements.filter((el) => el.type.toLowerCase() === 'draw')
      if (drawElements.length) {
        fn = insertSignatureLogic(fn, drawElements)
      }

      if (pages.length === 1) {
        fn = removeNodeFrom('MemberExpression')(fn, (name, node) => node.name === 'changePageBy')
      }

      return lazyWriter(componentPath, fn)
    }

    // make the html templates
    const makeHTMLRenderers = (formData) => {
      const componentPath = path.join(COMPONENT_PATH, `component-${formName}.html`)
      formData.elements = elementTransducer(formData._elements, pages).join('')
      let formHtml = formTemplate(formData)
      if (formData.pageNumbers && htmlTemplates['pagination']) {
        const paginationTemplate = htmlTemplates['pagination']
        formHtml += paginationTemplate(formData)
      }
      return lazyWriter(componentPath, formHtml)
    }

    // form module
    const moduleOptions = Object.assign({}, angularise(form))

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
  }
}

module.exports = processForm
