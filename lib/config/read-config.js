'use strict'

const blinkmrc = require('@blinkmobile/blinkmrc')

const configStore = blinkmrc.projectConfig({})

function readConfig () {
  return configStore.load().then((cfg) => {
    const formsCfg = cfg.forms

    if (!formsCfg) {
      return Promise.reject(new Error('Forms Config not found'))
    }

    return formsCfg
  })
}

module.exports = readConfig
