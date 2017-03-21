'use strict'

function loadPlugin (pluginName) {
  try {
    return require(pluginName)
  } catch (err) {
    return null
  }
}

module.exports = loadPlugin
