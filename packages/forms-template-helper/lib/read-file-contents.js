'use strict'

const fs = require('fs')

const maybeRun = require('@blinkmobile/maybe-run')

function readContents (path) {
  return new Promise((resolve, reject) => {
    const notError = maybeRun(reject)
    fs.readFile(path, 'utf-8', (err, contents) => {
      notError(err) && resolve(contents)
    })
  })
}

module.exports = {
  readContents
}
