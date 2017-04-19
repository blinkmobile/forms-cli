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

    const e = execa.shell(`npm install ${pkgJsonPath ? '--save ' : ''}${pluginPath}`)

    return e.then(getStream(e.stdout))
      .then((output) => {
        logger.info(`
${output}`)
        return readConfig()
      }).catch((err) => {
        logger.debug(JSON.stringify(err))
        handleNPMerror(err.stderr)
        return readConfig()
      })
  })
}

module.exports = addPlugin
