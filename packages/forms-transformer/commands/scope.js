'use strict'

const writeUserConfig = require('../lib/config/write-user-config.js')
const readConfig = require('../lib/config/read-config.js')
const userLogger = require('../lib/logger/loggers.js').userLogger

function scope (cliInput) {
  const scope = cliInput[0]

  if (scope) {
    return writeUserConfig({scope}).then(() => userLogger.info(`Your EPS scope is set to ${scope}`))
  }

  return readConfig(true).then((cfg) => {
    if (cfg.scope) {
      return userLogger.info(`Your EPS scope is set to ${cfg.scope}`)
    }

    userLogger.info(`You have not set an EPS scope yet.

Please use the command \`bm forms scope <eps url>\` to set one`)
  })
}

module.exports = scope
