(function(angular) {
  'use strict'

  function {{controllerName}}{{#variation}}_{{variation}}{{/variation}}_Controller () {

    this.save = (model) => console.log('i am saving ', model)
  }

  angular.module('{{name}}').component('{{name}}{{#variation}}_{{variation}}{{/variation}}', {
    templateUrl: '../templates/{{name}}{{#variation}}_{{variation}}{{/variation}}.html',
    controller: {{controllerName}}{{#variation}}_{{variation}}{{/variation}}_Controller
  })
})(window.angular)
