'use strict'

const resolvePluginName = require('./resolve-plugin-name.js')

function loadPlugin (framework) {
  if (!framework) {
    throw new Error('No Front end framework specified')
  }

  const pluginName = resolvePluginName(framework)

  try {
    return require(pluginName)
  } catch (err) {
    return null
  }
}

module.exports = loadPlugin
