'use strict'

const userLogger = require('../lib/logger/loggers.js').userLogger
const readConfig = require('../lib/config/read-config.js')
const loadPlugin = require('../lib/plugin-system/load-plugin.js')

function build () {
  userLogger.info('Running build command')
  return readConfig().then((cfg) => {
    const plugin = loadPlugin(cfg.framework)
    return plugin.build(cfg).then(() => ({options: cfg}))
  })
}

module.exports = build
