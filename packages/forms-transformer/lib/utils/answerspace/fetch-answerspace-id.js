'use strict'

const fetch = require('node-fetch')

const debugLogger = require('../../logger/loggers.js').debugLogger
const parseUrl = require('./parse-answerspace-url.js').toConfigUrl

const INVALID_ANSWERSPACE = 'answerSpace or EPS url is not valid. Please ensure it is the full url, including https://'

function fetchAnswerspaceId (answerspaceUrl) {
  const configUrl = parseUrl(answerspaceUrl)
  debugLogger.debug(`Supplied answerspace url: ${answerspaceUrl}`)
  debugLogger.debug(`Config URL = ${configUrl}`)

  return fetch(configUrl)
    .then((res) => res.json())
    .catch(() => Promise.reject(new Error(INVALID_ANSWERSPACE))) // makes inquirier print a better error than what fetch.json() does
    .then((config) => {
      const answerspaceKeys = Object.keys(config).filter((key) => key[0].toLowerCase() === 'a')

      if (answerspaceKeys.length === 1) {
        return answerspaceKeys[0].substr(1)
      }

      debugLogger.error(`Invalid Answerspace URL: ${configUrl}`)
      return Promise.reject(new Error(INVALID_ANSWERSPACE))
    })
}

module.exports = fetchAnswerspaceId
