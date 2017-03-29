'use strict'

const readConfig = require('../lib/config/read-config.js')

function build () {
  return readConfig().then((cfg) => {
    const plugin = require(cfg.framework)
    return plugin.build(cfg).then(() => ({options: cfg}))
  })
}

module.exports = build
