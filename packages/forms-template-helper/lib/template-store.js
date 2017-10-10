'use strict'

const Template = require('./template.js')

class TemplateStore {
  static get DEFAULT_STORE_NAME () {
    return 'default'
  }

  add (template, formName) {
    if ((template instanceof Template) === false) {
      throw new Error('Only objects of type `Template` can be stored in a template store')
    }
    formName = formName || TemplateStore.DEFAULT_STORE_NAME

    if (!this[formName]) {
      this[formName] = new Map()
    }

    this[formName].set(template.id, template)
  }

  getTemplates (formName = TemplateStore.DEFAULT_STORE_NAME) {
    return this[formName]
  }
}

module.exports = TemplateStore
