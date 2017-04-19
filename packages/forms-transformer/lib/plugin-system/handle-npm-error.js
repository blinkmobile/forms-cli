'use strict'

const logger = require('../logger/loggers.js').userLogger
const debugLogger = require('../logger/loggers.js').debugLogger
const handle404 = require('./error-handlers/404.js')

function handleNPMerror (errText) {
  const errCodeMatch = errText.match(/code\s*e(\d+)/i)

  if (!errCodeMatch) {
    // We cant pull a code out of NPM output so print the error
    debugLogger.debug('Could not match error message')
    debugLogger.error(errText)
    logger.error(`Unexpected NPM error:
${errText}

`)
    return
  }

  const errCode = errCodeMatch[1]
  debugLogger.error(`NPM Error Code: ${errCode}`)
  switch (errCode) {
    case '404': {
      logger.info(handle404(errText))
      break
    }
  }
}

module.exports = handleNPMerror
