'use strict'

const writeUserConfig = require('../lib/config/write-user-config.js')
const readConfig = require('../lib/config/read-config.js')

function scope (cliInput) {
  const scope = cliInput[0]

  if (scope) {
    return writeUserConfig({scope}).then((cfg) => ({formData: {}, options: cfg}))
  }

  return readConfig(true).then((cfg) => ({formData: {}, options: cfg.forms || {}}))
}

module.exports = scope
