'use strict'

function handle404 (errString) {
  const nameMatch = errString.match(/404\s+'(.+?)' is not in the npm registry/i)

  let name = 'plugin'
  if (nameMatch) {
    name = nameMatch[1]
  }

  return `
${name} could not be found by npm.
Please check the address is valid and try again.
`
}

module.exports = handle404
