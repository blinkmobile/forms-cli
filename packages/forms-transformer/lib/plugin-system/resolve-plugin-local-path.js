'use strict'

const path = require('path')

const findUp = require('find-up')

function resolvePluginLocalPath (pluginName) {
  const modulesPath = findUp.sync('node_modules')

  if (!modulesPath) {
    throw new Error('`node_modules` not found, have you installed the plugin yet?')
  }

  return path.join(modulesPath, ...pluginName.split('/'))
}

module.exports = resolvePluginLocalPath
