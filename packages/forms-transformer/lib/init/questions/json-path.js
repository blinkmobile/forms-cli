'use strict'

const path = require('path')

module.exports = {
  name: 'definitionSource',
  message: 'Which folder has the JSON files?',
  type: 'input',
  default: './form-json',
  filter: (input) => path.posix.relative('.', input) || '.'
}
