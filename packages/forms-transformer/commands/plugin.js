'use strict'

const DidYouMean = require('did-you-mean')

const logger = require('../lib/logger.js').logger
const help = require('../lib/plugin-system/help.js')
const readConfig = require('../lib/config/read-config.js')

const didYouMean = new DidYouMean('add remove info')
didYouMean.ignoreCase()

const commands = {
  add: require('../lib/plugin-system/add-plugin.js'),
  remove: () => Promise.reject(new Error('command "remove" not implemented')),
  info: () => Promise.reject(new Error('command "info" not implemented'))
}

function plugin (input) {
  const cmd = input[0]
  const pluginName = input[1]

  const finish = () => readConfig().then((cfg) => ({formData: {}, options: cfg}))

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

Did you mean: plugin ${alt} ?`
    }
    return Promise.reject(new Error(msg))
  }

  return fn(pluginName).then(finish)
}

module.exports = plugin
