'use strict'

// foreign modules

const meow = require('meow')
const updateNotifier = require('update-notifier')
const log = require('../lib/logger.js').logger

// local modules

const pkg = require('../package.json')
const help = require('../lib/help.js')

// this module
updateNotifier({ pkg }).notify()

const commands = {
  create: require('../commands/create.js'),
  init: require('../commands/init.js')
}

const cli = meow({
  help,
  version: true
}, {
  string: ['create', 'init']
})

const command = cli.input[0]

if (!command) {
  cli.showHelp(1)
}

if (!commands[command]) {
  log.fatal(`unknown command: ${command}`)
  cli.showHelp(1)
}

commands[command](cli.input.slice(1), cli.flags, { cwd: process.cwd() })
  .catch((err) => {
    log.error(`
There was a problem executing '${command}':

${err}

Please fix the error and try again.
`)
    process.exitCode = 1
  })
