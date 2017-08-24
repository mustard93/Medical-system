define('project-dt/controllers-saleReturnMedicalItem', ['project-dt/init'], function() {
  /**
   * [saleReturnMedicalItemController 新建销退单药品列表tr控制器]
   * @method saleReturnMedicalItemController
   * @param  {[type]}                        $scope [description]
   * @return {[type]}                               [description]
   */
  function saleReturnMedicalItemController ($scope) {

    // 错误状态标识
    $scope.quantityError = false;


    // 监视值变化
    $scope.$watch('item.quantity', function (newVal) {
        if ($scope.item.returnQuantity >= 0) {
          if (newVal > $scope.item.returnQuantity) {
            $scope.quantityError = true;
            $scope.$parent.$parent.quantityError = true;
          } else {
            $scope.quantityError = false;
            $scope.$parent.$parent.quantityError = false;
          }
        }
    });
  }

  angular.module('manageApp.project-dt')
  .controller('saleReturnMedicalItemController', ['$scope', saleReturnMedicalItemController]);
});
