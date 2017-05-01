'use strict'

const url = require('url')

const debugLogger = require('../../logger/loggers.js').debugLogger

const fetch = require('node-fetch')

const getHost = (_, answerspaceUrl) => {
  const uri = url.parse(answerspaceUrl)

  return `${uri.protocol}//${uri.host}${uri.port ? ':' + uri.port : ''}`
}

function fetchForms (scope, aid) {
  const configUrl = getHost`${scope}` + `/_R_/common/3/xhr/GetForm.php?_v=3&_aid=${aid}`

  debugLogger.debug(`Retrieving form details from ${configUrl}`)

  return fetch(configUrl)
    .then((res) => res.json())
    .then((json) => json.map((def) => JSON.parse(def)))
}

module.exports = fetchForms
