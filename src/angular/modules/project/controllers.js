/**
 * Created by hao on 15/11/5.
 */
define('project/controllers', ['project/init'], function() {

  /**
   * 主控（业务模块级别）
   */
  function mainCtrlProject($scope, $rootScope, $http, $location, store,utils,modal,OPrinter,UICustomTable,bottomButtonList,saleOrderUtils,purchaseOrderUtils,requestPurchaseOrderUtils,queryItemCardButtonList,customMenuUtils) {

    //底部菜单（业务相关）
    $rootScope.bottomButtonList=bottomButtonList;
    $rootScope.saleOrderUtils=saleOrderUtils;
    $rootScope.purchaseOrderUtils=purchaseOrderUtils;
    $rootScope.requestPurchaseOrderUtils=requestPurchaseOrderUtils;
    $rootScope.queryItemCardButtonList=queryItemCardButtonList;
    $rootScope.customMenuUtils=customMenuUtils;
  }

  /**
   * [watchFormCtrl 站内消息]
   * @method watchFormCtrl
   * @param  {[type]}      $scope          [description]
   * @param  {[type]}      watchFormChange [description]
   * @return {[type]}                      [description]
   */
  function watchFormCtrl($scope, watchFormChange) {

    $scope.watchFormChange=function(watchName){
      watchFormChange(watchName,$scope);
    }

  }


   /**
    * [intervalCtrl 定时任务ctrl]
    * @method intervalCtrl
    * @param  {[type]}     $scope      [description]
    * @param  {[type]}     modal       [description]
    * @param  {[type]}     alertWarn   [description]
    * @param  {[type]}     requestData [description]
    * @param  {[type]}     alertOk     [description]
    * @param  {[type]}     alertError  [description]
    * @param  {[type]}     $rootScope  [description]
    * @param  {[type]}     $interval   [description]
    * @return {[type]}                 [description]
    */
  function intervalCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,$interval) {

  }

  /**
   * [indexPageController 首页控制器]
   * @param  {[type]} $socpe [description]
   * @return {[type]}        [description]
   */
  function indexPageController ($socpe, utils) {

  }

  angular.module('manageApp.project')
  .controller('indexPageController', ['$scope', 'utils', indexPageController])
  .controller('mainCtrlProject',  ["$scope","$rootScope","$http", "$location", "store","utils","modal","OPrinter","UICustomTable","bottomButtonList","saleOrderUtils","purchaseOrderUtils","requestPurchaseOrderUtils","queryItemCardButtonList","customMenuUtils", mainCtrlProject])
  .controller('watchFormCtrl', ['$scope','watchFormChange', watchFormCtrl])
  .controller('intervalCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError','$rootScope','$interval', intervalCtrl]);
});
