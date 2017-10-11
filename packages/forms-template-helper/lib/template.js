'use strict'

const path = require('path')

const createRendererFn = require('./renderer-mustache.js').createRenderer

class Template {
  constructor (templatePath) {
    this.templatePath = templatePath
    this.createRenderer()
  }

  get id () {
    return path.basename(this.templatePath, '.mustache')
  }

  createRenderer () {
    this.render = createRendererFn(this.templatePath)
  }
}

module.exports = Template
