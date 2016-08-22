'use strict'

const mustache = require('mustache')

module.exports = (template) => {
  mustache.parse(template)
  return (el) => mustache.render(template, el)
}
