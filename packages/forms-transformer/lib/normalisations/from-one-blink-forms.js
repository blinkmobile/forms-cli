'use strict'

const pSeries = require('p-series')
const fetch = require('node-fetch')

const debugLogger = require('../logger/loggers.js').debugLogger
const BlinkMobileIdentity = require('@blinkmobile/bm-identity')
const pkg = require('../../package.json')
const blinkMobileIdentity = new BlinkMobileIdentity(pkg.name)
const origin = require('../utils/get-one-blink-api-origin.js')

function normalise (options) {
  // for each id, retrieve def and add to response array
  return blinkMobileIdentity.getAccessToken()
    .then((jwt) => {
      const fns = options.definitionSource.map((formId) => {
        return () => {
          return fetch(`${origin(options)}/v1/forms/${formId}`, { headers: { Authorization: `Bearer ${jwt}` } })
            .then((res) => res.json())
            .then((body) => {
              if (body.error) {
                debugLogger.error(body.message)
                throw new Error(body.message)
              }
              return body.definition
            })
        }
      })
      return pSeries(fns)
    })
}

module.exports = normalise
