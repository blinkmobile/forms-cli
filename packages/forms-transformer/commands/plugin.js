'use strict'

const DidYouMean = require('did-you-mean')

const logger = require('../lib/logger.js').logger
const help = require('../lib/plugin-system/help.js')

const didYouMean = new DidYouMean('add remove info')
didYouMean.ignoreCase()

const commands = {
  add: () => Promise.reject(new Error('command "add" not implemented')),
  remove: () => Promise.reject(new Error('command "remove" not implemented')),
  info: () => Promise.reject(new Error('command "info" not implemented'))
}

function plugin (cmd) {
  cmd = cmd[0]
  if (!cmd) {
    logger.info(help)

    return Promise.reject(new Error('No command specified'))
  }

  const fn = commands[cmd]

  if (!fn) {
    let msg = `unknown command: plugin ${cmd}`
    const alt = didYouMean.get(cmd)
    if (alt) {
      msg = `${msg}

Did you mean: plugin ${didYouMean.get(cmd)} ?`
    }
    return Promise.reject(new Error(msg))
  }

  return fn()
}

module.exports = plugin
