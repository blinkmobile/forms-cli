  function {{moduleName}}EditController () {
    // the form model
    this.model = this.model || {}

    // lifecycle functions
    this.$onInit = () => true
    this.$onChanges = (changesObj) => true
    this.$doCheck = () => true
    this.$onDestroy = () => true
    this.$postLink = () => true
    this.save = (model) => console.log('i am saving ', model)
  }

  angular.module('{{moduleName}}').component('{{moduleName}}Edit', {
    templateUrl: '../templates/{{name}}_edit.html',
    controller: {{moduleName}}EditController
  })
