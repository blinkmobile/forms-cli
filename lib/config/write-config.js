'use strict'

const blinkmrc = require('@blinkmobile/blinkmrc')

const configStore = blinkmrc.projectConfig({})

function writeConfig (cfg) {
  if (cfg.overwrite) {
    delete cfg.overwrite
  }

  return configStore.update((blinkmrc) => {
    blinkmrc.forms = cfg

    return blinkmrc
  }).then(() => cfg)
}

module.exports = writeConfig
