'use strict'

const blinkmrc = require('@blinkmobile/blinkmrc')
const configStore = blinkmrc.userConfig({name: '@blinkmobile/forms-lib'})

function writeConfig (cfg) {
  return configStore.write(cfg)
}

module.exports = writeConfig
