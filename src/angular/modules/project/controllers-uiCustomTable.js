define('project/controllers-uiCustomTable', ['project/init'], function() {
  /**
   * [uiCustomTableEditCtrl 用户自定义表格模块控制器]
   * @method uiCustomTableEditCtrl
   * @param  {[type]}              $scope          [description]
   * @param  {[type]}              modal           [description]
   * @param  {[type]}              alertWarn       [description]
   * @param  {[type]}              alertError      [description]
   * @param  {[type]}              requestData     [description]
   * @param  {[type]}              watchFormChange [description]
   * @return {[type]}                              [description]
   */
  function uiCustomTableEditCtrl($scope, modal, alertWarn, alertError, requestData, watchFormChange) {

        $scope.watchFormChange = function(watchName){
          watchFormChange(watchName,$scope);
        };

        // 树形菜单中选项被点击后，监控customTable对象变化，并获取响应数据重新渲染右侧表单内容
        $scope.$watchCollection('formData.customTable', function (newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            // 用户点击了树中不同节点，请求当前节点的信息
            var _className = newVal['className'];
            var _key = newVal['key'];
            var _reqUrl = 'rest/authen/uiCustomTable/getOfEdit.json?className='+_className+'&key='+_key;
            requestData(_reqUrl)
            .then(function (results) {
              if (results[1].code === 200) {
                $scope.formData = results[1].data;  // 新获取的模块配置数据赋值给当前表单数据对象

              }
            })
            .catch(function (error) {
              if (error) { throw new Error(error || '出错'); }
            })
          }
        });
        // 点击选中某个字段
        $scope.selectThisItem=function(item){
          $scope.itemShow=item;
        }

        // 保存之后是否依然选中
        $scope.isSelectItem=function(item){

        }

      // 点击隐藏按钮，隐藏当前选中的该字段
        $scope.hiddenThisItem=function(hiddenItem){

          if (hiddenItem) {
            for (var i = 0; i < $scope.formData.items.length; i++) {
              if ($scope.formData.items[i].propertyKey==hiddenItem.propertyKey) {
                $scope.formData.items[i].showFlag=false;
                // 把该字段先加入隐藏列
                $scope.formData.noShowItems.push($scope.formData.items[i]);
                // 再把该字段从显示列中去除
                $scope.formData.items.splice(i,1);
              }
            }

          }
        }
      // 点击显示按钮，显示当前选中的该字段
        $scope.showThisItem=function(showItem){

          if (showItem) {
            for (var i = 0; i < $scope.formData.noShowItems.length; i++) {
              if ($scope.formData.noShowItems[i].propertyKey==showItem.propertyKey) {
                $scope.formData.noShowItems[i].showFlag=true;
                // 把该字段先加入隐藏列
                $scope.formData.items.push($scope.formData.noShowItems[i]);
                // 再把该字段从显示列中去除
                $scope.formData.noShowItems.splice(i,1);
              }
            }
          }
        }


        // 点击上移按钮，把该列向上移动
        $scope.changeUpThisItem=function(upItem){
          if (upItem) {
            for (var i = 1; i < $scope.formData.items.length; i++) {
              if ($scope.formData.items[i].propertyKey==upItem.propertyKey) {
                // 改变在列表中显示的顺序
                var tmp=$scope.formData.items[i];
                $scope.formData.items[i]=$scope.formData.items[i-1];
                $scope.formData.items[i-1]=tmp;
              }
            }
          }
        }
        // 点击下移按钮，把该列向下移动
        $scope.changeDownThisItem=function(downItem){
          if (downItem) {

            for (var i =0 ; i <$scope.formData.items.length-1 ; i++) {
              if ($scope.formData.items[i].propertyKey==downItem.propertyKey) {
                // 改变在列表中显示的顺序
                var tmp=$scope.formData.items[i];
                $scope.formData.items[i]=$scope.formData.items[i+1];
                $scope.formData.items[i+1]=tmp;
                return;
              }
            }
          }
        }
        // 重置操作，点击重置按钮，调用重置接口传入Id
        $scope.resetTableData=function(id){
          var _reqUrl = 'rest/authen/uiCustomTable/reset.json?id='+id;
          var data={};
          requestData(_reqUrl,data, 'POST')
          .then(function (results) {
            if (results[1].code === 200) {
              $scope.formData = results[1].data;  // 新获取的模块配置数据赋值给当前表单数据对象
              $scope.itemShow={};
            }
          })
          .catch(function (error) {
            if (error) { throw new Error(error || '出错'); }
          })
        };

  }//end salesOrderEditCtrl

  angular.module('manageApp.project')
  .controller('uiCustomTableEditCtrl', ['$scope',"modal",'alertWarn',"alertError", "requestData", "watchFormChange", uiCustomTableEditCtrl]);
});
