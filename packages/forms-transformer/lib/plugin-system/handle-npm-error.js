'use strict'

const logger = require('../logger.js').logger
const handle404 = require('./error-handlers/404.js')

function handleNPMerror (err) {
  logger.debug(JSON.stringify(err))
  const errCodeMatch = err.stderr.match(/code\s*e(\d+)/i)

  if (!errCodeMatch) {
    // We cant pull a code out of NPM output so print the error
    logger.error(err)

    return
  }

  const errCode = errCodeMatch[1]
  switch (errCode) {
    case '404': {
      logger.info(handle404(err.stderr))
      break
    }
  }
}

module.exports = handleNPMerror
