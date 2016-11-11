'use strict'

const fs = require('fs')
const path = require('path')

const pify = require('pify')
const pfs = pify(fs)

function folderToObject (folder) {
  return pfs.access(folder)
            .then(() => pfs.readdir(folder))
            .then((files) => files.reduce((memo, filename) => {
              memo[path.basename(filename, '.js')] = require(path.join(folder, filename))
              return memo
            }, {}))
            .catch((err) => console.log(`Error reading ${folder}:

${err.message}`))
}

module.exports = folderToObject
