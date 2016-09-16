'use strict'

const fs = require('fs')

const t = require('transducers-js')

const getInteractions = t.filter(require('./lib/filters/is-interaction.js'))
const flatten = require('./lib/transforms/flatten-definition.js')

function processForm (options) {
  const definition = options.definition
  const elementTransducer = options.elementTransducer
  const formTemplate = options.formTemplate
  const formControllerTemplate = options.formControllerTemplate

  // loop through each form in a definition running the
  // transduers on the data
  const result = definition.reduce((memo, form) => {
    // grab what we need to pass down into the form element transducer
    const elements = form.default._elements
    const header = form.default.header
    const footer = form.default.footer

    // html transducer
    const toFormElement = t.map((formType) => {
      const formTypeName = formType[0]
      const formTypeData = formType[1]
      formTypeData.elements = elementTransducer(formTypeName, elements, formTypeData._elements).join('')
      formTypeData.header = formTypeData.header || header
      formTypeData.footer = formTypeData.footer || footer
      return { [formTypeData.interaction]: formTemplate(formTypeData) }
    })
    const formHTMLXf = t.comp(getInteractions, toFormElement)
    const formHTML = t.transduce(formHTMLXf, Object.assign, {}, form)

    // make the controller
    const toFormController = t.map((formType) => {
      const formTypeName = formType[0]
      const formTypeData = flatten(formTypeName)(form)

      return () => {
        return new Promise((resolve, reject) => {
          const filename = `./output/js/${formTypeData.interaction || 'subform-' + form.name}-controller.js`
          fs.writeFile(filename, formControllerTemplate(formTypeData, true), (err) => {
            if (err) {
              return reject(err)
            }

            resolve(filename)
          })
        })
      }
    })

    const formControllerXf = t.comp(getInteractions, toFormController)
    const controllersArray = t.into([], formControllerXf, form)

    return Promise.all(controllersArray.map((fn) => fn())).then(() => Object.assign(memo, {[form.default.uniqueNameId]: formHTML}))
  }, {})

  return result
}

module.exports = {processForm}
