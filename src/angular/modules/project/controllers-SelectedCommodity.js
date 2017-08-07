define('project/controllers-SelectedCommodity', ['project/init'], function() {
  /**
   * [SelectedCommodityEditCtrl description]
   * @method SelectedCommodityEditCtrl
   * @param  {[type]}                  $scope          [description]
   * @param  {[type]}                  watchFormChange [description]
   * @param  {[type]}                  requestData     [description]
   * @param  {[type]}                  utils           [description]
   * @param  {[type]}                  alertError      [description]
   * @param  {[type]}                  alertWarn       [description]
   */
  function SelectedCommodityEditCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

    // 选中相应药品类别，放入数组中传到后台
    $scope.choiceCommodityType=function(item){
      console.log(item.value);
      if(item.value){
        if($scope.formData.type === null){
          $scope.formData.type=[];
        }
      $scope.formData.type.push(item.text);
    }else {
      $scope.formData.type.pop(item.text);
    }
    };

    $scope.$watch('!initFlag', function (newVal) {
      var scopeData= [];

      for(var item in $scope.scopeData){

        scopeData.push($scope.scopeData[item]);

        if ($scope.formData. type) {
          for(j=0;j<$scope.formData. type.length;j++){

            if($scope.formData. type[j]==$scope.scopeData[item].value){
            $scope.scopeData[item].value=true;
            }
          }
        }
      }
    });

    $scope.watchFormChange = function(watchName){
      watchFormChange(watchName,$scope);
    };
  }

  angular.module('manageApp.project')
  .controller('SelectedCommodityEditCtrl', ['$scope',"watchFormChange",'requestData',"utils", "alertError", "alertWarn", SelectedCommodityEditCtrl]);
});
