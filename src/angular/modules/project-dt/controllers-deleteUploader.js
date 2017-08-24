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
