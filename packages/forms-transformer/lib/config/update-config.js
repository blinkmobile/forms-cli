'use strict'

const blinkmrc = require('@blinkmobile/blinkmrc')

function writeConfig (cfg, userConfig = false) {
  const configStore = userConfig ? blinkmrc.userConfig({name: '@blinkmobile/forms-lib'}) : blinkmrc.projectConfig()
  if (cfg.overwrite) {
    delete cfg.overwrite
  }

  return configStore.update((blinkmrc) => {
    blinkmrc.forms = blinkmrc.forms || {}
    cfg.apiService = blinkmrc.forms.apiService
    blinkmrc.forms = cfg

    return blinkmrc
  }).then(() => cfg)
}

module.exports = writeConfig
