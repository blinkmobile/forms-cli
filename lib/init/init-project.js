'use strict'

const blinkmrc = require('@blinkmobile/blinkmrc')
const configExists = require('./questions/config-exists.js')

function init () {
  const configStore = blinkmrc.projectConfig({})

  return configStore.load()
    .catch(() => ({}))
    .then((cfg) => cfg.forms ? configExists() : cfg)
}

module.exports = init
