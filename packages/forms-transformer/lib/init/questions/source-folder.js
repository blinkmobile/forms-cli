'use strict'

const path = require('path')

module.exports = {
  name: 'outputPath',
  message: 'Which folder should I write the component source to?',
  type: 'input',
  default: './bm-forms-src',
  filter: (input) => path.posix.relative('.', input) || '.'
}
