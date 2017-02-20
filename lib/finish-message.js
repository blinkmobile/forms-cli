'use strict'

const path = require('path')

/* Tagged template literal */
function finishMessage (strings, ...values) {
  const framework = values[0]
  const srcLocation = values[1]
  const componentLocation = srcLocation.split('/')

  // account for if they put a trailing / on the end of the path
  if (!componentLocation[componentLocation.length]) {
    componentLocation.pop()
  }
  componentLocation.pop()
  componentLocation.push('dest') // hardcoded dest, replace with config
  componentLocation.push('bm-forms.js') // hardcoded to match gulp file, replace with config

  return `
=========================================================
Finished creating the Forms Component for ${framework}

Source Location: ${path.resolve(srcLocation)}

Compiled Component Location: ${path.resolve(path.join.apply(null, componentLocation))}
` + strings.join(' ') + `
=========================================================`
}

module.exports = finishMessage
