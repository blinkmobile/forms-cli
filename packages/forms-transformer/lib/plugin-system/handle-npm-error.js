'use strict'

const logger = require('../logger.js').logger
const handle404 = require('./error-handlers/404.js')

function handleNPMerror (errText) {
  const errCodeMatch = errText.match(/code\s*e(\d+)/i)

  if (!errCodeMatch) {
    // We cant pull a code out of NPM output so print the error
    logger.error('Could not match error message')
    logger.error(`Raw NPM error message:
${errText}

`)
    return
  }

  const errCode = errCodeMatch[1]
  switch (errCode) {
    case '404': {
      logger.info(handle404(errText))
      break
    }
  }
}

module.exports = handleNPMerror
