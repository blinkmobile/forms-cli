'use strict'

const path = require('path')

const findUp = require('find-up')

function resolvePluginLocalPath (pluginName) {
  const modulesPath = findUp.sync('node_modules')

  if (!modulesPath) {
    throw new Error('folder `node_modules` not found')
  }

  return path.join(modulesPath, ...pluginName.split('/'))
}

module.exports = resolvePluginLocalPath
