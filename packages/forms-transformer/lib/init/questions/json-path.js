'use strict'

const path = require('path')

module.exports = {
  name: 'definitionSource',
  message: 'Which folder has the JSON files (globs accepted)?',
  type: 'input',
  default: './form-json',
  filter: (input) => {
    let result = path.posix.relative('.', input) || '.'
    if (/\.json$/.test(result)) {
      return result
    }

    return `${result}/**/*.json`
  }
}
