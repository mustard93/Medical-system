define('project-dt/controllers-ScreenFinanceApproval', ['project-dt/init'], function() {
  /**
   * [ScreenFinanceApprovalController 财务审批模块中queyr页面获取当前财务审批人]
   * @method ScreenFinanceApprovalController
   * @param  {[type]}                        $scope [description]
   */
  function ScreenFinanceApprovalController ($scope) {
    if ($scope.tr.operationFlowSet) {
      // 获取当前订单状态
      // var _status = $scope.tr.orderStatus;
      // 查找流程数组里符合当前订单状态的
      angular.forEach($scope.tr.operationFlowSet, function (item, index) {
        if(item.status === '待付款') {
          $scope.tr.approvalPayUser = item;
        }
      });
    }
  }

  angular.module('manageApp.project-dt')
  .controller('ScreenFinanceApprovalController', ['$scope', ScreenFinanceApprovalController]);
});
