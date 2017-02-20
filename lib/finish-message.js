'use strict'

const path = require('path')

/* Tagged template literal */
function finishMessage (strings, ...values) {
  const framework = values[0]
  const srcLocation = values[1]

  let componentLocation = srcLocation.split('/').filter((p) => p.trim())
  componentLocation.pop()
  componentLocation = [...componentLocation, 'dest', 'bm-forms.js']

  return `
=========================================================
Finished creating the Forms Component for ${framework}

Source Location: ${path.resolve(srcLocation)}

Compiled Component Location: ${path.resolve(path.join(...componentLocation))}
` + strings.join(' ') + `
=========================================================`
}

module.exports = finishMessage
