/**
 *  Components组件模块
 *  create by liuzhen at 2017/06/19
 */
define('main/components', ['main/init'], function () {
  angular.module('manageApp.main')
  // 测试component组件方法
  .component('testComponent', {
    template: '<div>Test - Components</div>',
    bindings: {
      test: '='
    },
    controller: ['$scope', function ($scope) {
      console.log($scope);
    }]
  })

  /**
   * 页头组件，包含上下两部分结构，上部为面包屑导航，下部为标题和新建按钮
   * @type {[type]}
   */
  .component('headerContainerComponent', {
    templateUrl: Config.tplPath + 'tpl/components/headerContainerComponent.html',
    bindings: {
      test: '<'
    },
    controller: ['$scope', function ($scope) {

    }]
  });
});
