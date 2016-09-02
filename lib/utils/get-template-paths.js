'use strict'

const path = require('path')
const fs = require('fs')

function readDir (basePath) {
  return new Promise((resolve, reject) => {
    fs.readdir(basePath, (err, files) => {
      if (err) {
        return reject(err)
      }

      resolve(files.map((file) => path.join(basePath, file)))
    })
  })
}

module.exports = {
  getTemplatePaths: readDir
}
