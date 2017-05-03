'use strict'

module.exports = {
  name: 'inputSource',
  type: 'list',
  message: 'What is the source of your from definition?',
  default: 'answerspace',
  choices: [
    {
      name: 'AnswerSpace',
      short: 'AnswerSpace',
      value: 'answerspace'
    },
    {
      name: 'JSON Files',
      short: 'JSON Files',
      value: 'json_files'
    }
  ]
}
