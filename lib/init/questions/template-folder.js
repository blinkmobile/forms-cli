'use strict'

const path = require('path')

module.exports = {
  name: 'templates',
  message: 'What folder should I create the Framework templates in?',
  type: 'input',
  default: './bm-forms/templates',
  filter: (input) => {
    const relPath = path.posix.relative('.', input) || '.'

    return {
      viewTemplates: path.posix.join(relPath, 'html/*.mustache'),
      scriptTemplates: path.posix.join(relPath, 'js/*.mustache'),
    }
  },
  when: (answers) => answers.overwrite
}
