'use strict'

const glob = require('glob')

const maybeRun = require('@blinkmobile/maybe-run')

function getFileList (basePath) {
  return new Promise((resolve, reject) => {
    const notError = maybeRun(reject)

    glob(basePath, (err, files) => {
      notError(err) && resolve(files)
    })
  })
}

function getFolderList (basePath) {
  if (!/\/$/.test()) {
    basePath += '/'
  }

  return getFileList(basePath)
}

module.exports = {
  getFileList,
  getFolderList
}
