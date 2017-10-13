// @flow
'use strict'

const debugLogger = require('../lib/logger/loggers.js').debugLogger

const askQuestions = require('../lib/init/ask-questions.js')
const updateConfig = require('../lib/config/update-config.js')
const addPlugin = require('../lib/plugin-system/add-plugin.js')
const loadPlugin = require('../lib/plugin-system/load-plugin.js')

function init (
  commands /* : string[] */,
  flags /* : Object */
) /* : Promise<void> */ {
  return askQuestions()
    .then(updateConfig)
    .then((cfg) => {
      if (cfg.framework.toLowerCase() === 'custom') {
        return cfg
      }

      // TODO: this will only work once plugins are published
      return addPlugin(cfg.framework)
    })
    .then((cfg) => {
      return loadPlugin(cfg.framework)
        .then((plugin) => plugin.init(cfg))
    })
    .catch((err) => {
      if (err && err.message.toLowerCase() === 'cancelled') {
        debugLogger.debug('User cancelled operation')
        return Promise.resolve()
      }

      // make sure the error message gets up to the top level promise#catch
      return Promise.reject(err)
    })
}

module.exports = init
