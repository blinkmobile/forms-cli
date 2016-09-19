'use strict'

function {{name}}{{#variation}}_{{variation}}{{/variation}}_Controller () {

  this.save = (model) => console.log('i am saving ', model)
}

angular.module('{{name}}').component({{name}}_{{variation}}, {
  templateUrl: '../templates/{{name}}{{#variation}}_{{variation}}{{/variation}}.html',
  controller: {{name}}{{#variation}}_{{variation}}{{/variation}}_Controller
})
