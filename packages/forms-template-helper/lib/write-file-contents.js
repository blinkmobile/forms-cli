// @flow
'use strict'

const fs = require('fs')
const path = require('path')

const mkdirp = require('mkdirp')

const maybeRun = require('@blinkmobile/maybe-run')

function writeFileContents (
  p /* : string */,
  contents /* : string */
) /* : Promise<string> */ {
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

function lazyWriter (
  p /* : string */,
  contents /* : string */
) /* : (string) => Promise<string> */ {
  return (basePath = '' /* string */) => writeFileContents(path.join(basePath, p), contents)
}

module.exports = {
  writeFileContents,
  lazyWriter
}
