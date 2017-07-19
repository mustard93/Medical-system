define('project/controllers-archiveCodeStrategy', ['project/init'], function() {
  /**
   * [archiveCodeStrategyController 档案编号策略模块控制器]
   * @method archiveCodeStrategyController
   * @param  {[type]}                      $scope      [description]
   * @param  {[type]}                      alertOk     [description]
   * @param  {[type]}                      alertError  [description]
   * @param  {[type]}                      requestData [description]
   * @return {[type]}                                  [description]
   */
  function archiveCodeStrategyController ($scope, alertOk, alertError, requestData) {
    // 当用户修改后，如果级别值为空，则从对象中删除
    $scope.chkLevelChange = function (levelMap) {

      $scope.levelSetError = false;

      if (levelMap) {
        // 如果等级被删除则从数据对象中删除此等级
        for (var level in levelMap) {
          if (levelMap.hasOwnProperty(level)) {
            if (!levelMap[level]) { delete levelMap[level]; }
          }
        }

        // 如果等级被置空，且下一个等级有值，则屏蔽提交按钮
        for(var i = 1; i < 6; i++) {
          if (!levelMap['level'+i] && levelMap['level'+(i+1)]) {
            $scope.levelSetError = true;
          }
        }



      }
    }
  }

  angular.module('manageApp.project')
  .controller('archiveCodeStrategyController', ['$scope',"alertOk",'alertError',"requestData", archiveCodeStrategyController]);
});
