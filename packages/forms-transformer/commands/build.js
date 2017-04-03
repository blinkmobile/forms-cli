'use strict'

const readConfig = require('../lib/config/read-config.js')
const loadPlugin = require('../lib/plugin-system/load-plugin.js')

function build () {
  return readConfig().then((cfg) => {
    const plugin = loadPlugin(cfg.framework)
    return plugin.build(cfg).then(() => ({options: cfg}))
  })
}

module.exports = build
