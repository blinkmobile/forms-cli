'use strict'

const fetchAnswerspace = require('../../utils/answerspace/fetch-answerspace-id.js')

module.exports = {
  name: 'answerspace',
  message: 'What is your answerspace name or eps url',
  type: 'input',
  filter: (input) => fetchAnswerspace(input).then((id) => input),
  when: (answers) => answers.overwrite
}
