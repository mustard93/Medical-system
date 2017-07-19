define('project/controllers-deleteUploader', ['project/init'], function() {
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
  }

  angular.module('manageApp.project')
  .controller('deleteUploaderController', ['$scope',"$timeout",'alertOk',"alertError", "requestData", deleteUploaderController]);
});
