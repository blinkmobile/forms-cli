'use strict'

const mustache = require('mustache')
const log = require('../logger.js').logger

module.exports = (template) => {
  mustache.parse(template, [ '<%', '%>' ])
  return (el) => {
    log.debug(el)
    return mustache.render(template, el)
  }
}
