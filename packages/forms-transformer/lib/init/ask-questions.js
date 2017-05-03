'use strict'

const prompt = require('../prompt-config.js')
const inputSource = require('./questions/input-source.js')
const jsonPath = require('./questions/json-path.js')
const configExists = require('./questions/config-exists.js')
const whichAnswerspace = require('./questions/which-answerspace.js')
const whichFramework = require('./questions/which-framework.js')
const sourceFolder = require('./questions/source-folder.js')
const distFolder = require('./questions/dist-folder.js')
const templateLocation = require('./questions/template-folder.js')

const questions = [
  sourceFolder,
  distFolder,
  templateLocation,
  whichFramework
]

function init () {
  return prompt.prompt(configExists)
                .catch((err) => err.code === 'ENOENT' ? Promise.resolve({overwrite: true}) : Promise.reject(err))
                .then((answers) => {
                  if (answers.overwrite === false) {
                    return Promise.reject(new Error('cancelled'))
                  }

                  return prompt.prompt(inputSource).then((answers) => {
                    let q = jsonPath
                    if (answers.inputSource === 'answerspace') {
                      q = whichAnswerspace
                    }

                    return prompt.prompt([q, ...questions])
                  })
                })
}

module.exports = init
