'use strict'

let plugin

function loadPlugin (pluginName) {
  plugin = plugin || require(pluginName)

  return plugin
}

module.exports = loadPlugin
