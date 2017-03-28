'use strict'

const path = require('path')

module.exports = {
  name: 'distPath',
  message: 'Which folder should I write the component distribution file to?',
  type: 'input',
  default: (answers) => path.posix.join(path.posix.dirname(answers.outputPath), 'dist'),
  filter: (input) => path.posix.relative('.', input) || '.'
}
