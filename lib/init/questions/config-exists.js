'use strict'

const blinkmrc = require('@blinkmobile/blinkmrc')

const configStore = blinkmrc.projectConfig({})

module.exports = {
  name: 'overwrite',
  type: 'confirm',
  message: 'Configuration already present in config file. Are you sure you want to overwrite it',
  default: true, // TODO change to false after testing
  when: configStore.load.bind(configStore)
}
