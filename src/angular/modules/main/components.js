/**
 *  Components组件模块
 *  create by liuzhen
 */
define('main/components', ['main/init'], function () {
  angular.module('manageApp.main')
  .component('testComponent', {
    template: '<div>测试Component1</div>',
    bindings: {},
    controller: function () {
      console.log('aaabbb');
    }
  });
});
