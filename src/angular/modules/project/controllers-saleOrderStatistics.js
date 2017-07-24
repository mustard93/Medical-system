define('project/controllers-orderStatistics', ['project/init'], function() {
  /**
   * [orderStatisticsController 销售、采购、消退、采退统计表控制器]
   * @method orderStatisticsController
   * @param  {[type]}                      $scope          [description]
   * @param  {[type]}                      modal           [description]
   * @param  {[type]}                      alertWarn       [description]
   * @param  {[type]}                      alertError      [description]
   * @param  {[type]}                      alertOk         [description]
   * @param  {[type]}                      requestData     [description]
   * @param  {[type]}                      watchFormChange [description]
   * @return {[type]}                                      [description]
   */
  function orderStatisticsController ($scope, modal, alertWarn, alertError, alertOk, requestData, watchFormChange) {
    // 定义初始化的表格列定义modal
    $scope.initTableTheadModal = [
      {'name': '年'},
      {'name': '月'},
      {'name': '单据数量'},
      {'name': '销售数量'},
      {'name': '销售金额'}
    ];

    // 初始化系统默认显示的列信息
    // $scope.initTableTbodyModal

    // 处理用户查询中类型变更事件
    $scope.handleTypeChange = function () {
      console.log('aa');
    }


  }

  angular.module('manageApp.project')
  .controller('orderStatisticsController', ['$scope',"modal",'alertWarn',"alertError", "alertOk", "requestData", "watchFormChange", orderStatisticsController]);
});
