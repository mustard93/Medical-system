/**
 *  Components组件模块
 *  create by liuzhen
 */
define('main/components', ['main/init'], function () {
  function testComponent () {
    return {
      template: '<div>Test - Components</div>',
      bindings: {
        test: '='
      },
      controller: ['$scope', function ($scope) {
        console.log($scope);
      }]
    }
  }


  angular.module('manageApp.main')
  .component('testComponent', [testComponent]);
});
