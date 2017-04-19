'use strict'

const execa = require('execa')
const getStream = require('get-stream')
const findUp = require('find-up')

const userLogger = require('../logger/loggers.js').userLogger
const debugLogger = require('../logger/loggers.js').debugLogger
const readConfig = require('../config/read-config.js')
const handleNPMerror = require('./handle-npm-error.js')

function addPlugin (pluginPath) {
  if (!pluginPath) {
    return Promise.reject(new Error('add: Plugin path not specified.'))
  }

  return findUp('package.json').then((pkgJsonPath) => {
    userLogger.info(`Installing ${pluginPath}`)

    const e = execa.shell(`npm install ${pkgJsonPath ? '--save ' : ''}${pluginPath}`)

    return e.then(getStream(e.stdout))
      .then((output) => {
        userLogger.info(`
${output}`)
        return readConfig()
      }).catch((err) => {
        debugLogger.error(err)
        handleNPMerror(err.stderr)
        return readConfig()
      })
  })
}

module.exports = addPlugin
