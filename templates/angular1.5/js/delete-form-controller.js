  function {{moduleName}}DeleteController () {
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

  angular.module('{{moduleName}}').component('{{moduleName}}Delete', {
    templateUrl: '../templates/{{name}}_delete.html',
    controller: {{moduleName}}DeleteController
  })
