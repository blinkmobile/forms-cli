'use strict'

module.exports = {
  name: 'inputSource',
  type: 'list',
  message: 'What is the source of your from definition?',
  default: 'answerspace',
  choices: ['AnswerSpace', 'JSON Files'],
  filter: (answer) => answer.toLowerCase().replace(' ', '_')
}
