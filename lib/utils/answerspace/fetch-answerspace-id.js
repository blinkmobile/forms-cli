'use strict'

const fetch = require('node-fetch')
const log = require('../../logger.js').logger

const parseUrl = require('./parse-answerspace-url.js').toConfigUrl

const INVALID_ANSWERSPACE = 'Answerspace url is not valid'

function fetchAnswerspaceId (answerspaceUrl) {
  const configUrl = parseUrl(answerspaceUrl)
  log.debug(`Supplied answerspace url: ${answerspaceUrl}`)
  log.debug(`Answerspace URL = ${configUrl}`)

  return fetch(configUrl)
          .then((res) => res.json())
          .catch(() => Promise.reject(new Error(INVALID_ANSWERSPACE))) // makes inquirier print a better error than what fetch.json() does
          .then((config) => {
            const answerspaceKeys = Object.keys(config).filter((key) => key[0].toLowerCase() === 'a')

            if (answerspaceKeys.length === 1) {
              return answerspaceKeys[0].substr(1)
            }

            return Promise.reject(new Error(INVALID_ANSWERSPACE))
          })
          .catch((err) => Promise.reject(err))
}

module.exports = fetchAnswerspaceId
