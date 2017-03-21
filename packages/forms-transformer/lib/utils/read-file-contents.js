'use strict'

const fs = require('fs')

function readContents (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, contents) => {
      if (err) {
        return reject(err)
      }

      resolve(contents)
    })
  })
}

module.exports = {
  readContents
}
