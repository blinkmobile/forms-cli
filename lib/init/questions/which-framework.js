'use strict'

module.exports = {
  name: 'framework',
  message: 'What front end framework are you using?',
  type: 'list',
  default: 0,
  choices: function (answers) {
    return ['AngularJS']
  },
  when: (answers) => answers.overwrite || answers.overwrite === undefined
}
