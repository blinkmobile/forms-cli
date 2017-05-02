#!/usr/bin/env node

'use strict'

// foreign modules

const meow = require('meow')
const updateNotifier = require('update-notifier')
const loggers = require('../lib/logger/loggers.js')
const userLogger = loggers.userLogger
const errorLogger = loggers.errorLogger
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

loggers.init(cli.flags.debug)

if (!commands[command]) {
  userLogger.info(`  unknown command: ${command}`)
  const alt = didYouMean.get(command)
  alt && userLogger.info(`  Did you mean: ${alt} ?`)
  cli.showHelp(1)
}

const msg = finishMessage(command, cli.flags)

commands[command](cli.input.slice(1), cli.flags, { cwd: process.cwd() })
  .then(({formData, options} = {formData: {}, options: {}}) => userLogger.info(msg`${options.framework}${options.sourcePath}${options.distPath}${options.templatePath}${options.scope}`))
  .catch((err) => {
    userLogger.info(`There was a problem executing '${command}':

${err}

Please fix the error and try again.
`
)
    errorLogger.error(err)
    process.exitCode = 1
  })
