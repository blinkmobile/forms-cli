'use strict'

function fixIdElements (el) {
  if (el.type === 'text' && el.name === 'id') {
    el.type = 'hidden'
  }

  return el
}

module.exports = fixIdElements
