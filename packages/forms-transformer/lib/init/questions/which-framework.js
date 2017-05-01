'use strict'

const resolveBlinkPlugin = require('../../plugin-system/resolve-plugin-name.js')

module.exports = {
  name: 'framework',
  message: 'What front end framework are you using?',
  type: 'list',
  default: 0,
  choices: function (answers) {
    return ['AngularJS', 'JSON', 'Custom']
  },
  filter: function (input) {
    if (input.toLowerCase() === 'custom') {
      return input
    }

    return resolveBlinkPlugin(input)
  }
}
