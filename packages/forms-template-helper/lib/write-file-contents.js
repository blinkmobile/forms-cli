'use strict'

const fs = require('fs')
const path = require('path')

const mkdirp = require('mkdirp')

const maybeRun = require('@blinkmobile/maybe-run')

function writeFileContents (p, contents) {
  return new Promise((resolve, reject) => {
    const notError = maybeRun(reject)
    const dirname = path.dirname(p)

    mkdirp(dirname, (err) => {
      if (notError(err)) {
        fs.writeFile(p, contents, (err) => {
          notError(err) && resolve(p)
        })
      }
    })
  })
}

module.exports = {
  writeFileContents,
  lazyWriter: (p, contents) => (basePath = '') => writeFileContents(path.join(basePath, p), contents)
}
