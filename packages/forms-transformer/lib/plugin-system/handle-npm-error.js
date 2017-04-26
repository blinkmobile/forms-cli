'use strict'

const debugLogger = require('../logger/loggers.js').debugLogger
const handle404 = require('./error-handlers/404.js')

function handleNPMerror (errText) {
  const errCodeMatch = errText.match(/code\s*e(\d+)/i)

  if (!errCodeMatch) {
    // We cant pull a code out of NPM output so print the error
    debugLogger.debug('Could not match error message')
    debugLogger.error(errText)
    return `Unexpected NPM error:
${errText}
`
  }

  const errCode = errCodeMatch[1]
  debugLogger.error(`NPM Error Code: ${errCode}`)
  switch (errCode) {
    case '404': {
      return handle404(errText)
    }
  }
}

module.exports = handleNPMerror
