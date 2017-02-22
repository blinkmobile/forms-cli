'use strict'

const log = require('../lib/logger.js').logger

const askQuestions = require('../lib/init/ask-questions.js')
const writeConfig = require('../lib/config/write-config.js')
const writeTemplates = require('../lib/init/write-templates.js')

function init () {
  return askQuestions()
    .then(writeConfig)
    .then(writeTemplates)
    .catch((err) => {
      if (err.message.toLowerCase() === 'cancelled') {
        log.debug('User cancelled operation')
        return Promise.resolve()
      }

      // make sure the error message gets up to the top level promise#catch
      return Promise.reject(err)
    })
}

module.exports = init
