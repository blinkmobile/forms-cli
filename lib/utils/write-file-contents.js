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
      console.log('writing to ' + p)
      fs.writeFile(p, contents, (err) => {
        if (err) {
          return reject(err)
        }

        resolve(p)
      })
    })
  })
}

module.exports = {writeFileContents}
