'use strict'

const fetchAnswerspace = require('../../utils/answerspace/fetch-answerspace-id.js')

module.exports = {
  name: 'answerspace',
  message: 'Which is your answerSpace or EPS url?',
  type: 'input',
  filter: (input) => fetchAnswerspace(input).then((id) => input),
  when: (answers) => answers.overwrite || answers.overwrite === undefined
}
