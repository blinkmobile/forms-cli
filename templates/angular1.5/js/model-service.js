(function (angular) {
  'use strict'

  angular.module('{{moduleName}}').factory('{{moduleName}}Model', [function BlinkModelFactory () {
    function {{moduleName}}Model () {
      {{#_elements}}
      this.{{name}} = ''
      {{/_elements}}
    }

    {{name}}Model.prototype.set = function (modelObj) {
      console.log('setting values!')
    }

    return new {{moduleName}}Model()
  }])
})(window.angular)
