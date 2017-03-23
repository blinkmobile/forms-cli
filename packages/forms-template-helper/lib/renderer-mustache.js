'use strict'

const mustache = require('mustache')
const co = require('co')

const readContents = require('./read-file-contents.js').readContents

const createRenderer = co.wrap(function * (templatePath) {
  const templateString = yield readContents(templatePath)
  return mustache(templateString)
})

module.exports = {
  createRenderer,
  renderer: (template) => {
    mustache.parse(template, [ '<%', '%>' ])

    return (el) => mustache.render(template, el)
  }
}
