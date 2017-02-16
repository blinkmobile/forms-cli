'use strict'

// foreign modules

const updateNotifier = require('update-notifier')
const log = require('./lib/logger.js').logger

// local modules

const pkg = require('./package.json')
const help = require('./lib/help.js')

// this module

const commands = {
  create: () => log.error('Not yet implemented'),
  init: () => log.error('Not yet implemented')
}

updateNotifier({ pkg }).notify()

module.exports = function (input, flags) {
  const command = input[0]

  if (!command) {
    log.info(help)
    /* eslint-disable no-process-exit */
    process.exit(0)
    /* eslint-enable no-process-exit */
  }

  if (!commands[command]) {
    log.fatal(`unknown command: ${command}`)
    log.info(help)
    /* eslint-disable no-process-exit */
    process.exit(1)
    /* eslint-enable no-process-exit */
  }

  if (typeof commands[command] !== 'function') {
    log.fatal('not implemented')
    /* eslint-disable no-process-exit */
    process.exit(1)
    /* eslint-enable no-process-exit */
  }

  commands[command](input.slice(1), flags, { cwd: process.cwd() })
}
