(function(angular) {
  'use strict'

  function {{moduleName}}{{#variation}}_{{variation}}{{/variation}}_Controller () {
    // the form model
    this.model = this.model || []

    // lifecycle functions
    this.$onInit = () => true
    this.$onChanges = (changesObj) => true
    this.$doCheck = () => true
    this.$onDestroy = () => true
    this.$postLink = () => true
    this.save = (model) => console.log('i am saving ', model)
  }

  angular.module('{{moduleName}}').component('{{moduleName}}{{#variation}}{{variation}}{{/variation}}', {
    templateUrl: '/{{name}}/templates/{{name}}{{#variation}}_{{variation}}{{/variation}}.html',
    controller: {{moduleName}}{{#variation}}_{{variation}}{{/variation}}_Controller
  })
})(window.angular)
