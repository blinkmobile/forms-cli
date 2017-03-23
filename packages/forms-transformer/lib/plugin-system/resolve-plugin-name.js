'use strict'

const PREFIX = '@blinkmobile/bm-plugin-forms-'

function resolveBlinkPluginName (name) {
  name = name.toLowerCase()

  if (name.indexOf(PREFIX) !== 0) {
    return `${PREFIX}${name}`
  }

  return name
}

module.exports = resolveBlinkPluginName
