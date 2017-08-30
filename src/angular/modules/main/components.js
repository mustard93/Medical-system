/**
 *  Components组件模块
 *  create by liuzhen at 2017/06/19
 */
define('main/components', ['main/init'], function () {
  angular.module('manageApp.main')
  /**
   * 页头容器组件，包含上下两部分结构，上部为面包屑导航，下部为标题和新建按钮
   * @type {[type]}
   * @author  liuzhen
   * @date  2017/06/28
   */
  .component('headerContainerComponent', {
    templateUrl: Config.tplPath + 'tpl/components/headerContainerComponent.html',
    bindings: {
      crumbsNav: '<',
      isShowCreateBtn: '<',
      componentTitle: '@'
    },
    controller: ['$scope', function ($scope) {
      // 组件初始化Hook
      this.$onInit = function () {
        // ...
      };


    }]
  })
  
  /**
   *  页头组件中，订单状态按钮组组件
   *  @author  liuzhen
   *  @date  2017/07/02
   */
  .component('headerStatusBtnGroup', {
    bindings: {

    },
    controller: ['$scope', 'requestData', function ($scope, requestData) {
      // 初始化请求数据
      this.$onInit = function () {

      }
    }]
  });
});
