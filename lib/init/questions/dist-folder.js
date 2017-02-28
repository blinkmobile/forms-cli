'use strict'

const path = require('path')

module.exports = {
  name: 'distPath',
  message: 'What folder should I write the component distribution file to?',
  type: 'input',
  default: './bm-forms/dist',
  filter: (input) => path.posix.relative('.', input) || '.',
  when: (answers) => answers.overwrite || answers.overwrite === undefined
}
