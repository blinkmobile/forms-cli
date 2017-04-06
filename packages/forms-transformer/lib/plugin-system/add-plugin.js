'use strict'

const execa = require('execa')
const getStream = require('get-stream')
const findUp = require('find-up')

const logger = require('../logger.js').logger
const updateConfig = require('../config/update-config.js')
const readConfig = require('../config/read-config.js')
const handleNPMerror = require('./handle-npm-error.js')

function addPlugin (pluginPath) {
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
      // .then((cfg) => {
      //   cfg.
      // })
  })
}

module.exports = addPlugin
