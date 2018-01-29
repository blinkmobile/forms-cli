'use strict'

module.exports = {
  name: 'inputSource',
  type: 'list',
  message: 'What is the source of your from definition?',
  default: 'oneBlinkForms',
  choices: [
    {
      name: 'OneBlink Forms',
      short: 'OneBlink Forms',
      value: 'oneBlinkForms'
    },
    {
      name: 'JSON Files',
      short: 'JSON Files',
      value: 'json_files'
    },
    {
      name: 'AnswerSpace',
      short: 'AnswerSpace',
      value: 'answerspace'
    }
  ]
}
