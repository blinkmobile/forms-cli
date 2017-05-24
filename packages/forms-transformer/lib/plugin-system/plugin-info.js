'use strict'

const findUp = require('find-up')

const userLogger = require('../logger/loggers.js').userLogger
const debugLogger = require('../logger/loggers.js').debugLogger

const readConfig = require('../config/read-config.js')

function pluginInfo () {
  return readConfig().then((cfg) => {
    if (!cfg || !cfg.framework) {
      return Promise.reject(new Error('No framework plugin in `.blinkmrc.json`'))
    }

    return findUp(`node_modules/${cfg.framework}`).then((filePath) => {
      let packageJson
      try {
        packageJson = require(`${filePath}/package.json`)
      } catch (e) {
        debugLogger.error(e)
        return Promise.reject(new Error(`Could not find ${cfg.framework}. Has it been installed?`))
      }

      userLogger.info(cfg.framework)
      if (packageJson.description) {
        userLogger.info(`Description: ${packageJson.description}`)
      }

      if (packageJson.version) {
        userLogger.info(`Version: ${packageJson.version}`)
      }
    })
  })
}

module.exports = pluginInfo
