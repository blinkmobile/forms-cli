'use strict'

const url = require('url')

const PROTOCOL = 'https'
const HOST_NAME = 'blinkm.co'
const CONFIG_PATH = '/_R_/common/3/xhr/GetConfig.php'
const ASN_QUERY = '_asn'

function toUrlObj (answerspaceUrl) {
  if (!/^https?:\/\/.*/i.test(answerspaceUrl)) {
    answerspaceUrl = `${PROTOCOL}://${HOST_NAME}/${answerspaceUrl}`
  }

  return url.parse(answerspaceUrl, true)
}

// config url: https://blinkm.co/_R_/common/3/xhr/GetConfig.php?_asn=${asn}
function toConfigUrl (answerspaceUrl) {
  const queryString = {[ASN_QUERY]: ''}
  const obj = toUrlObj(answerspaceUrl)

  queryString[ASN_QUERY] = obj.pathname.substring(1)
  obj.pathname = CONFIG_PATH
  obj.query = Object.assign((obj.query), queryString)

  return url.format(obj)
}

module.exports = {
  toConfigUrl
}
