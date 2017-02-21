'use strict'

const log = require('../logger.js').logger

const prompt = require('../prompt-config.js')
const configExists = require('./questions/config-exists.js')
const whichAnswerspace = require('./questions/which-answerspace.js')
const whichFramework = require('./questions/which-framework.js')
const sourceFolder = require('./questions/source-folder.js')
const templateLocation = require('./questions/template-folder.js')

const questions = [
  configExists,
  whichAnswerspace,
  whichFramework,
  sourceFolder,
  templateLocation
]

function init () {
  return prompt.prompt(questions)
    .then((answers) => answers.overwrite ? answers : Promise.reject(new Error('cancelled')))
    .then(log.info.bind(log))
    .catch((err) => {
      if (err.message) {
        switch (err.message.toLowerCase()) {
          case 'cancelled':
            log.debug('User cancelled operation')
            break
          default:
            log.err(err)
        }
      }
    })
}

module.exports = init
