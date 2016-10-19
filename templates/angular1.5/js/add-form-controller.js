(function (angular) {
  'use strict'

  function {{moduleName}}{{#variation}}{{variation}}{{/variation}}Controller (model) {
    // the form model
    this.model = model || {}

    // lifecycle functions
    this.$onInit = () => true
    this.$onChanges = (changesObj) => true
    this.$doCheck = () => true
    this.$onDestroy = () => true
    this.$postLink = () => true

    this.save = (model) => console.log('i am saving ', model)
  }

  {{moduleName}}{{#variation}}{{variation}}{{/variation}}Controller.$inject = ['{{#serviceNames}}{{name}},{{/serviceNames}}']

  angular.module('{{moduleName}}').component('{{moduleName}}{{#variation}}{{variation}}{{/variation}}', {
    templateUrl: '/{{name}}/templates/{{name}}{{#action}}_{{action}}{{/action}}.html',
    controller: {{moduleName}}{{#variation}}{{variation}}{{/variation}}Controller,
    bindings: {
      model: '=?'
    }
    // require: {
    //   model: '^?form'
    // }
  })
})(window.angular)
