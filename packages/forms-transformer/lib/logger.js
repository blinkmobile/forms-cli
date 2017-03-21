'use strict'

const log4js = require('log4js')

let logger = log4js.getLogger('BlinkForms')
setLogLevel('INFO')
log4js.configure({
  appenders: [{
    type: 'console',
    layout: {
      type: 'basic'
    }
  }]
})

function config (config) {
  log4js.configure(config)
}

function setLogLevel (level) {
  logger.setLevel(level)
}

module.exports = {logger, config, setLogLevel}
