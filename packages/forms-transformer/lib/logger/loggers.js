'use strict'

const logSystem = require('./log-config.js')
const log4js = logSystem.log4js
const CATEGORIES = logSystem.CATEGORIES

const userLogger = log4js.getLogger(CATEGORIES.USER)
const errorLogger = log4js.getLogger(CATEGORIES.ERROR)
const debugLogger = log4js.getLogger(CATEGORIES.DEBUG)

debugLogger.setLevel(log4js.levels.NONE)

module.exports = {
  userLogger,
  errorLogger,
  debugLogger,
  init: (isDebugMode) => {
    logSystem.init({isDebugMode})
    debugLogger.setLevel(log4js.levels.ALL)
  }
}
