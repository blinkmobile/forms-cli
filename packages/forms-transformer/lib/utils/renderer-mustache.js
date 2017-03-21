'use strict'

const mustache = require('mustache')
const log = require('../logger.js').logger

module.exports = (template) => {
  mustache.parse(template, [ '<%', '%>' ])
  return (el) => {
    log.debug('Creating mustache template for element:')
    log.debug(el)
    return mustache.render(template, el)
  }
}
