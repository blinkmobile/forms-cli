'use strict'

const fs = require('fs')

const debugLogger = require('../logger/loggers.js').debugLogger

function normalise (fileList) {
  if (!Array.isArray(fileList)) {
    fileList = [fileList]
  }
  const options = {encoding: 'UTF-8'}

  return fileList.reduce((memo, jsonPath) => {
    try {
      const json = JSON.parse(fs.readFileSync(jsonPath, options))
      memo.push(json)
    } catch (err) {
      debugLogger.debug(`Could not parse json from ${jsonPath}:
${err}`)
    }
    return memo
  }, [])
}

module.exports = normalise
