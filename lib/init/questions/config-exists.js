'use strict'

// const blinkmrc = require('@blinkmobile/blinkmrc')

// const configStore = blinkmrc.projectConfig({})

module.exports = {
  name: 'overwrite',
  type: 'confirm',
  message: 'Forms configuration already present in your .blinkmrc.json file. Are you sure you want to overwrite it?',
  default: false,
  when: () => false // configStore.load().then(() => true).catch(() => Promise.resolve(false)) not sure if we want to use this question
}
