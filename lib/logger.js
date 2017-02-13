'use strict'

const log4js = require('log4js')

let logger = log4js.getLogger('BlinkForms')
logger.setLevel('INFO')

function config (config) {
  log4js.configure(config)
}

module.exports = {logger, config}
