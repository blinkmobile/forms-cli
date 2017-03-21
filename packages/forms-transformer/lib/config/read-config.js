'use strict'

const blinkmrc = require('@blinkmobile/blinkmrc')

function readConfig (userConfig = false) {
  const configStore = userConfig ? blinkmrc.userConfig({name: '@blinkmobile/forms-lib'}) : blinkmrc.projectConfig()
  return configStore.load().then((cfg) => {
    const formsCfg = userConfig ? cfg : cfg.forms

    if (!formsCfg) {
      return Promise.reject(new Error('Forms Config not found'))
    }

    return formsCfg
  })
}

module.exports = readConfig
