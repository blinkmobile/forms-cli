'use strict'

const path = require('path')

module.exports = {
  name: 'templatePath',
  message: 'What folder should I create the Framework templates in?',
  type: 'input',
  default: './bm-forms/templates',
  filter: (input) => path.posix.relative('.', input) || '.',
  when: (answers) => answers.overwrite || answers.overwrite === undefined
}
