'use strict'

const fs = require('fs')
const path = require('path')

const mkdirp = require('mkdirp')

function writeFileContents (p, contents) {
  return new Promise((resolve, reject) => {
    const dirname = path.dirname(p)
    mkdirp(dirname, (err) => {
      if (err) {
        return reject(err)
      }

      fs.writeFile(p, contents, (err) => {
        if (err) {
          return reject(err)
        }

        resolve(p)
      })
    })
  })
}

module.exports = {
  writeFileContents,
  lazyWriter: (p, contents) => (basePath = '') => writeFileContents(path.join(basePath, p), contents)
}
