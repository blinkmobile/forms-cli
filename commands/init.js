'use strict'

const askQuestions = require('../lib/init/ask-questions.js')
const writeConfig = require('../lib/init/write-config.js')

function init () {
  return askQuestions().then(writeConfig)
}

module.exports = init
