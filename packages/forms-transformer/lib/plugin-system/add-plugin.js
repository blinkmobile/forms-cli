'use strict'

const execa = require('execa')
const getStream = require('get-stream')
const findUp = require('find-up')

const logger = require('../logger.js').logger
const readConfig = require('../config/read-config.js')
const handleNPMerror = require('./handle-npm-error.js')

function addPlugin (pluginPath) {
  if (!pluginPath) {
    return Promise.reject(new Error('add: Plugin path not specified.'))
  }

  return findUp('package.json').then((pkgJsonPath) => {
    logger.info(`Installing ${pluginPath}`)

    const e = execa.shell(`npm install ${pkgJsonPath ? '--save' : ''} ${pluginPath}`)
    const outputStream = e.stdout

    return e.then(() => getStream(outputStream))
      .then((data) => {
        outputStream.pipe(process.stdout)
        return readConfig()
      }).catch((err) => {
        handleNPMerror(err)
        return readConfig()
      })
  })
}

module.exports = addPlugin
