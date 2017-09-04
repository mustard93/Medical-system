define('project-dt/controllers-deleteUploader', ['project-dt/init'], function() {
  /**
   * [deleteUploaderController 删除上传的附件]
   * @method deleteUploaderController
   * @param  {[type]}                 $scope      [description]
   * @param  {[type]}                 $timeout    [description]
   * @param  {[type]}                 alertOk     [description]
   * @param  {[type]}                 alertError  [description]
   * @param  {[type]}                 requestData [description]
   * @return {[type]}                             [description]
   */
  function deleteUploaderController($scope, $timeout, alertOk, alertError, requestData){
    $scope.deleteUploader = function (_key) {
      if (_key) {
        var url='rest/authen/fileUpload/delete';
        var data= {key:_key};
        requestData(url,data,'post')
          .then(function (results) {

          })
          .catch(function (error) {
            alertError(error || '出错');
          });

      }
    };
    $scope.tipStr = "证书编号不能为空";
    $scope.tipChange = function(item){
      if(!item.certificateNumber) item.tipStr = "证书编号不能为空";
      else {
        var repetition = 0;
        for(var i = 0, len = $scope.ngModel.length; i < len; i++){
          if(item.licenseId == $scope.ngModel[i].licenseId && item.certificateNumber == $scope.ngModel[i].certificateNumber) repetition++
        }
        if(repetition > 1) item.tipStr = "不能输入重复的证书编号";
        else item.tipStr = null;
      }
    }
    //
    // $scope.$watch('userData.id',function(newVal,oldVal){
    //   if (newVal&&newVal!==oldVal) {
    //
    //     var url='rest/authen/userAndOrganization/getByUserId?userId='+$scope.userData.id;
    //     requestData(url,{},'get')
    //       .then(function (results) {
    //         var _data=results[1].data;
    //         $scope.ngModel[$index]
    //         console.log(_data);
    //       })
    //       .catch(function (error) {
    //         alertError(error || '出错');
    //       });
    //   }
    // })
  }

  angular.module('manageApp.project-dt')
  .controller('deleteUploaderController', ['$scope',"$timeout",'alertOk',"alertError", "requestData", deleteUploaderController]);
});
