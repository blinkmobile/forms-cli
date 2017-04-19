#!/usr/bin/env node

'use strict'

// foreign modules

const meow = require('meow')
const updateNotifier = require('update-notifier')
const log = require('../lib/logger.js').logger
const DidYouMean = require('did-you-mean')

// local modules

const pkg = require('../package.json')
const help = require('../lib/help.js')
const finishMessage = require('../lib/finish-message.js')

// this module
updateNotifier({ pkg }).notify()

const didYouMean = new DidYouMean('create build init plugin scope')
didYouMean.ignoreCase()
didYouMean.setThreshold(5)

const commands = {
  create: require('../commands/create.js'),
  build: require('../commands/build.js'),
  init: require('../commands/init.js'),
  plugin: require('../commands/plugin.js'),
  scope: require('../commands/scope.js')
}

const cli = meow({
  help,
  version: true
}, {
  string: ['create', 'init', 'build'],
  boolean: true,
  default: {
    build: true,
    templates: false
  }
})

const command = cli.input[0]

if (!command) {
  cli.showHelp(1)
}

if (!commands[command]) {
  log.fatal(`unknown command: ${command}`)
  const alt = didYouMean.get(command)
  alt && log.info(`Did you mean: ${alt} ?`)
  cli.showHelp(1)
}

const msg = finishMessage(command, cli.flags)

cli.flags.debug && log.setLevel('DEBUG')

commands[command](cli.input.slice(1), cli.flags, { cwd: process.cwd() })
  .then(({formData, options} = {formData: {}, options: {}}) => log.info(msg`${options.framework}${options.outputPath}${options.distPath}${options.templatePath}${options.scope}`))
  .catch((err) => {
    log.error(`

There was a problem executing '${command}':

${err}

${cli.flags.debug ? err.stack : ''}

Please fix the error and try again.
`)
    process.exitCode = 1
  })
