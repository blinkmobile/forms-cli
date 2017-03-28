'use strict'

const log = require('../../logger.js').logger

const fetch = require('node-fetch')

function fetchForms (aid) {
  const configUrl = `https://blinkm.co/_R_/common/3/xhr/GetForm.php?_v=3&_aid=${aid}`

  log.info('Retrieving form details')

  return fetch(configUrl)
    .then((res) => res.json())
    .then((json) => json.map((def) => JSON.parse(def)))
}

module.exports = fetchForms
