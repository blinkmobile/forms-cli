'use strict'

function fixCameraElements (el) {
  if (el.type === 'text' && el.name === 'id') {
    el.type = 'hidden'
  }

  return el
}

module.exports = fixCameraElements
