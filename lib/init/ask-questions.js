'use strict'

const prompt = require('../prompt-config.js')
const configExists = require('./questions/config-exists.js')
const whichAnswerspace = require('./questions/which-answerspace.js')
const whichFramework = require('./questions/which-framework.js')
const sourceFolder = require('./questions/source-folder.js')
const distFolder = require('./questions/dist-folder.js')
const templateLocation = require('./questions/template-folder.js')

const questions = [
  configExists,
  whichAnswerspace,
  whichFramework,
  sourceFolder,
  distFolder,
  templateLocation
]

function init () {
  return prompt.prompt(questions)
               .then((answers) => (answers.overwrite || answers.overwrite === undefined) ? answers : Promise.reject(new Error('cancelled')))
}

module.exports = init
