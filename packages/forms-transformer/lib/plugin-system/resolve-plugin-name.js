'use strict'

const PREFIX = 'bm-plugin-'

function resolvePluginName (name) {
  name = name.toLowerCase()

  if (name.indexOf(PREFIX) !== 0) {
    console.log(`${PREFIX}${name}`)
    return `${PREFIX}${name}`
  }

  return name
}

module.exports = resolvePluginName
