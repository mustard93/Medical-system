/**
 *  Components组件模块
 *  create by liuzhen
 */
define('main/components', ['main/init'], function () {
  angular.module('manageApp.main')
  .component('testComponent', {
    template: '<div>Test - Components</div>',
    bindings: {
      test: '='
    },
    controller: ['$scope', function ($scope) {
      console.log($scope);
    }]
  });
});
