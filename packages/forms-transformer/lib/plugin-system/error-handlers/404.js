'use strict'

function handle404 (errString) {
  const nameMatch = errString.match(/Not found\s*:\s*(.+?)\n/i)

  let name = ''
  if (nameMatch) {
    name = nameMatch[1]
  }

  return `
${name} could not be found by npm. It must be manually installed:
  - \`bm forms plugin add <repo-or-address>\`
  - alternatively via npm: \`npm install <repo-or-address>\`
`
}

module.exports = handle404
