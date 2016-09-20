'use strict'
// https://blinkm.co/_R_/common/3/xhr/SaveFormRecord.php?schema=3&_asid=20483&_fn=simple_form&_action=add
function resourceFactory($resource) {
  return $resource({{url}}, {{params}}, {{actions}}, {{options}} )
}

angular.module('{{name}}').factory('{{name}}ResourceFactory', resourceFactory)
