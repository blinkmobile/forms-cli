(function (angular) {
  'use strict'

  function {{controllerName}}{{#variation}}{{variation}}{{/variation}}Controller () {
    this.save = (model) => console.log('i am saving ', model)
  }

  angular.module('{{name}}').component('{{controllerName}}{{#variation}}{{variation}}{{/variation}}', {
    templateUrl: '{{name}}/templates/{{name}}{{#action}}_{{action}}{{/action}}.html',
    controller: {{controllerName}}{{#variation}}{{variation}}{{/variation}}Controller
  })
})(window.angular)
