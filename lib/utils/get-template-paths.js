'use strict'

const glob = require('glob')

function readDir (basePath) {
  return new Promise((resolve, reject) => {
    glob(basePath, (err, files) => {
      if (err) {
        return reject(err)
      }

      resolve(files/* .map((file) => path.join(basePath, file))*/)
    })
  })
}

module.exports = {
  getTemplatePaths: readDir
}
