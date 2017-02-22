'use strict'

const blinkmrc = require('@blinkmobile/blinkmrc')

const configStore = blinkmrc.projectConfig({})

module.exports = {
  name: 'overwrite',
  type: 'confirm',
  message: 'Forms configuration already present in your .blinkmrc.json file. Are you sure you want to overwrite it',
  default: true, // TODO change to false after testing
  when: () => configStore.load()
}
