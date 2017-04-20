'use strict'

const execa = require('execa')
const getStream = require('get-stream')
const findUp = require('find-up')

const userLogger = require('../logger/loggers.js').userLogger
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
${output.stdout}`)
      }).catch((err) => {
        handleNPMerror(err.stderr)
        return Promise.reject(err)
      })
  })
}

module.exports = addPlugin
