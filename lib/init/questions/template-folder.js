'use strict'

const path = require('path')

module.exports = {
  name: 'templatePath',
  message: 'Which folder should I create the Framework templates in?',
  type: 'input',
  default: (answers) => path.posix.join(path.posix.dirname(answers.outputPath), 'templates'),
  filter: (input) => path.posix.relative('.', input) || '.'
}
