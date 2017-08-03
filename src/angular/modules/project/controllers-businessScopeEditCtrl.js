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
          for (var i = 0; i < businessScope.length; i++) {
            for (var j = 0; j < scopeData.length; j++) {
              if (businessScope[i].code==scopeData[j].code) {
                scopeData[j].checked=true;
              }
            }
          }
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
      $scope.submitbusinessScope=function(_data,businessScope){
        var _businessScopeArr=[];
        if (_data) {
          for (var i = 0; i < _data.length; i++) {
            if (_data[i].checked) {
              var _businessScope={};
              _businessScope.name=_data[i].name;
              _businessScope.code=_data[i].code;
              // 如果没值，说明是第一次选择。就直接push
              _businessScopeArr.push(_businessScope)

                if (businessScope.length) {
                  for (var j = 0; j < businessScope.length; j++) {
                      // 判断是否是没有选过的项，如果不是，就不push进去。
                    if (businessScope[j].code==_businessScope.code) {
                      $scope.formData.businessScope.pop(_businessScope);
                    }
                  }
                }
            }
          }
          $scope.formData.businessScope=_businessScopeArr;
        }
      }

  }

  angular.module('manageApp.project')
  .controller('businessScopeEditCtrl', ['$scope',"watchFormChange",'requestData',"utils", "alertError", "alertWarn", businessScopeEditCtrl]);
});
