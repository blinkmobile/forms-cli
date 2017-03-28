'use strict'

function fixCameraElements (el) {
  if (el.type === 'file' && el.capture) {
    el.type = 'camera'
  }

  return el
}

module.exports = fixCameraElements
