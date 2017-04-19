'use strict'

const resolveLocalPlugin = require('./resolve-plugin-local-path.js')

let plugin

function loadPlugin (pluginName) {
  plugin = plugin || require(resolveLocalPlugin(pluginName))

  return plugin
}

module.exports = loadPlugin
