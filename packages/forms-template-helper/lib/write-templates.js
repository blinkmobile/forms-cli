'use strict'

const fs = require('fs')

const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const rcopy = require('recursive-copy')

const maybeRun = require('@blinkmobile/maybe-run')

function writeTemplates (srcFolder, destFolder) {
  return new Promise((resolve, reject) => {
    const notError = maybeRun(reject)

    rimraf(destFolder, (err) => {
      if (notError(err)) {
        mkdirp(destFolder, (err) => {
          if (notError(err)) {
            fs.access(srcFolder, (err) => {
              notError(err) && rcopy(srcFolder, destFolder, (err) => notError(err) && resolve(destFolder))
            })
          }
        })
      }
    })
  })
}

module.exports = writeTemplates
