define('project/controllers-businessScopeEditCtrl', ['project/init'], function() {
  /**
   * [businessScopeEditCtrl 首营各模块公用控制器]
   * @method businessScopeEditCtrl
   * @param  {[type]}               $scope          [description]
   * @param  {[type]}               watchFormChange [description]
   * @param  {[type]}               requestData     [description]
   * @param  {[type]}               utils           [description]
   * @param  {[type]}               alertError      [description]
   * @param  {[type]}               alertWarn       [description]
   */
  function businessScopeEditCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

      // 经营方式查询调用的方法
      $scope.filterName=function(q){
        if (q) {

          var url='rest/authen/businessScope/query?pageSize=999&q='+q;
          var data= {};
          requestData(url,data, 'get')
            .then(function (results) {
              $scope.scopeData= results[1].data;
            })
            .catch(function (error) {
              alertError(error || '出错');
            });
        }
      };


      // 之前选中的选项，再次选的时候。自动勾选上。
      $scope.reCheck=function(businessScope,scopeData){
        if (businessScope) {
          console.log(businessScope);
          console.log(scopeData);
        }
      }
      // 全选调用的方法，把所有的都传入，然后一一选中，放入businessScope中。
      $scope.selectAll=function(scopeData){
        if (scopeData) {
          for (var i = 0; i < scopeData.length; i++) {
            // 勾选
              scopeData[i].checked=true;
          }
        }
      }

      // 选择经营方式以后，调用的方法。
      $scope.submitbusinessScope=function(_data){

        if (_data) {
          for (var i = 0; i < _data.length; i++) {
            if (_data[i].checked) {
              var _businessScope={};
              _businessScope.name=_data[i].name;
              _businessScope.code=_data[i].code;
              $scope.formData.businessScope.push(_businessScope);
            }
          }
        }
      }

  }

  angular.module('manageApp.project')
  .controller('businessScopeEditCtrl', ['$scope',"watchFormChange",'requestData',"utils", "alertError", "alertWarn", businessScopeEditCtrl]);
});
