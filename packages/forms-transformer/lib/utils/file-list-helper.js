'use strict'

const glob = require('glob')

const rejectOnError = require('./maybe-reject-on-error.js')

function getFileList (basePath) {
  return new Promise((resolve, reject) => {
    const maybe = rejectOnError(reject)

    glob(basePath, (err, files) => {
      if (maybe(err)) {
        resolve(files)
      }
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
