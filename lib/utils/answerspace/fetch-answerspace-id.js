'use strict'

const fetch = require('node-fetch')

function fetchAnswerspaceId (asn) {
  const configUrl = `https://blinkm.co/_R_/common/3/xhr/GetConfig.php?_asn=${asn}`

  return fetch(configUrl).then((res) => res.json()).then((config) => {
    const answerspaceKeys = Object.keys(config).filter((key) => key[0].toLowerCase() === 'a')

    if (answerspaceKeys.length === 1) {
      return answerspaceKeys[0].substr(1)
    }

    return Promise.reject()
  })
}

module.exports = fetchAnswerspaceId
