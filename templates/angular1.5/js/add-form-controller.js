(function (angular) {
  'use strict'

  function {{moduleName}}{{#variation}}{{variation}}{{/variation}}Controller ($scope, model) {
    // the form model
    this.model = model || {}

    // lifecycle functions
    this.$onInit = () => true
    this.$onChanges = (changesObj) => true
    this.$doCheck = () => true
    this.$onDestroy = () => true
    this.$postLink = () => true

    this.save = (model) => console.log('i am saving ', model)

    const textboxContainsShow = () => ($scope.simple_form_add.textbox.$modelValue || '').indexOf('show') > -1

    this.textboxContainsShow_choiceIsChoice1_checkboxIsChecked = function () {
      const result = textboxContainsShow()
      return result
    }
  }

  {{moduleName}}{{#variation}}{{variation}}{{/variation}}Controller.$inject = ['$scope', '{{#serviceNames}}{{name}},{{/serviceNames}}']

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
