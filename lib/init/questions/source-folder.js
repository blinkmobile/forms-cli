'use strict'

const path = require('path')

module.exports = {
  name: 'outputPath',
  message: 'What folder should I write the component source to',
  type: 'input',
  default: './bm-forms/src',
  filter: (input) => path.posix.relative('.', input) || '.',
  when: (answers) => answers.overwrite || answers.overwrite === undefined
}
