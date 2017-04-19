'use strict'

const path = require('path')

const findUp = require('find-up')

const debugLogger = require('../logger/loggers.js').debugLogger

function resolvePluginLocalPath (pluginName) {
  const modulesPath = findUp.sync('node_modules')

  if (!modulesPath) {
    debugLogger.debug(`Could not find node_modules path when loading plugin '${pluginName}'. Searching up from ${process.cwd()}`)
    throw new Error('`node_modules` not found, have you installed the plugin yet?')
  }

  return path.join(modulesPath, ...pluginName.split('/'))
}

module.exports = resolvePluginLocalPath
