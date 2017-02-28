'use strict'

// const blinkmrc = require('@blinkmobile/blinkmrc')

// const configStore = blinkmrc.projectConfig({})

module.exports = {
  name: 'overwrite',
  type: 'confirm',
  message: 'Forms configuration already present in your .blinkmrc.json file. Are you sure you want to overwrite it?',
  default: false,
  when: () => false // configStore.load() - avoid bug in inquirer handling async rejections in when
}
