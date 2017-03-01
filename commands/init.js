'use strict'

const log = require('../lib/logger.js').logger

const askQuestions = require('../lib/init/ask-questions.js')
const writeConfig = require('../lib/config/write-config.js')
const readConfig = require('../lib/config/read-config.js')
const writeTemplates = require('../lib/init/write-templates.js')

function init () {
  const finish = () => readConfig().then((cfg) => ({formData: {}, options: cfg}))

  return askQuestions()
    .then(writeConfig)
    .then(writeTemplates)
    .then(finish)
    .catch((err) => {
      if (err && err.message.toLowerCase() === 'cancelled') {
        log.debug('User cancelled operation')
        return Promise.resolve(finish())
      }

      // make sure the error message gets up to the top level promise#catch
      return Promise.reject(err)
    })
}

module.exports = init
