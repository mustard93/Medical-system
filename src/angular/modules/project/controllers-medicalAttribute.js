define('project/controllers-medicalAttribute', ['project/init'], function() {
  /**
   * [medicalAttributeController 商品分类管理模块控制器]
   * @method medicalAttributeController
   * @param  {[type]}                   $scope      [description]
   * @param  {[type]}                   alertOk     [description]
   * @param  {[type]}                   alertError  [description]
   * @param  {[type]}                   alertWarn   [description]
   * @param  {[type]}                   requestData [description]
   * @param  {[type]}                   utils       [description]
   * @return {[type]}                               [description]
   */
  function medicalAttributeController ($scope, alertOk, alertError, alertWarn, requestData, utils) {

    // 定义是否显示右侧编辑界面
    $scope.showEditArea = false;

    // 定义保存节点信息类型，默认为修改节点信息。不再使用
    $scope.modifyNodeInfo = true;

    // 获取模块名，（商品分类模块、供应商分类模块、客户分类模块）
    // $scope.$watch('moduleName', function (newVal, oldVal) {
    //   if (newVal && newVal !== oldVal) {
    //     // 定义保存url
    //     var _saveUrl = 'rest/authen/' + $scope.moduleName + '/save.json';
    //     // 定义删除请求地址
    //     var _delUrl = 'rest/authen/' + $scope.moduleName + '/delete?id=';
    //   }
    // });

    // console.log(_saveUrl + '==>' +_delUrl);

    // 转换返回的JSON对象为JSON字符串
    $scope.filterJSONDate = function (data) {
      return JSON.stringify(data);
    }

    // 关闭新增主分类区域
    $scope.cancelAddClass = function () {

      $scope.showAddClass = $scope.showAddClass ? false :true;

      // if ($scope.showAddClass) {
      //   $scope.showAddClass = false;
      // } else {
      //   $scope.showAddClass = false;
      // }
    }

    // 添加主分类
    $scope.addMainClass = function (addMainClassObj) {
      if (addMainClassObj) {
        // 保存路径
        var _saveUrl = 'rest/authen/' + $scope.moduleName + '/save.json';
        // 发送请求保存数据
        requestData(_saveUrl, addMainClassObj, 'POST', 'parameterBody')
        .then(function (results) {
          alertOk('操作成功');
            console.log("addMainClass",results);
                $scope.$broadcast('zTreeUpdateNode',results[0]);
                $scope.showAddClass=false;
          // if (resutls[1].code === 200) {
          //   alertOk('操作成功');
          //   utils.refreshHref();
          // }
        })
        .catch(function (error) {
          if (error) { alertWarn(error) }
        });
      }
    }

    // 修改节点信息和保存子节点信息操作
    $scope.saveNodeInfo = function (medicalAttribute) {
      // 保存路径
      var _saveUrl = 'rest/authen/' + $scope.moduleName + '/save.json';

      requestData(_saveUrl, medicalAttribute, 'POST', 'parameterBody')
      .then(function (results) {
        alertOk('操作成功');
        console.log("saveNodeInfo",results);
          $scope.$broadcast('zTreeUpdateNode',results[0]);
          // $scope.formData.medicalAttribute=null;
        // if (results[1].code === 200) {
        //   alertOk('操作成功');
        //   utils.refreshHref();
        // } else {
        //   alertWarn(results[1].msg);
        // }
      })
      .catch(function (error) {
        if (error) { alertWarn(error); }
      })


      // if ($scope.modifyNodeInfo) {     // 修改节点信息
      //   requestData(_saveUrl, medicalAttribute, 'POST', 'parameterBody')
      //   .then(function (results) {
      //     alertOk('操作成功');
      //       $scope.$broadcast('zTreeReloadData');
      //     // if (results[1].code === 200) {
      //     //   alertOk('操作成功');
      //     //   utils.refreshHref();
      //     // } else {
      //     //   alertWarn(results[1].msg);
      //     // }
      //   })
      //   .catch(function (error) {
      //     if (error) { alertWarn(error); }
      //   })
      // } else {      // 新增子节点
      //   // 如果父节点id为空，则将当前节点id复制给父节点
      //   if (!medicalAttribute['parentId']) {
      //     medicalAttribute['parentId'] = angular.copy(medicalAttribute['id']);
      //   }
      //   // 将id置空，标识为新建节点
      //   medicalAttribute['id'] = null;
      //
      //   requestData(_saveUrl, medicalAttribute, 'POST', 'parameterBody')
      //   .then(function (results) {
      //
      //     alertOk('操作成功');
      //       $scope.$broadcast('zTreeReloadData');
      //
      //     // if (results[1].code === 200) {
      //     //   alertOk('操作成功');
      //     //   utils.refreshHref();
      //     // } else {
      //     //   alertWarn(results[1].msg);
      //     // }
      //   })
      //   .catch(function (error) {
      //     if (error) { alertWarn(error); }
      //   });
      // }
    }

    // 删除类别
    $scope.deleteThisClass = function () {
        var id=$scope.formData.medicalAttribute.id;
      if (id) {
        // 删除路径
        _delUrl = 'rest/authen/' + $scope.moduleName + '/delete?id=' + id
        requestData(_delUrl, {}, 'POST')
        .then(function (results) {
            $scope.$broadcast('zTreeRemoveNode',id);
              $scope.formData.medicalAttribute=null;
          //
          // if (results[1].code === 200) {
          //   // $scope._reloadData('rest/authen/medicalAttribute/query.json', 'scopeTreeData2')
          //   utils.refreshHref();
          // } else {
          //   alertWarn(results[1].msg);
          // }
        })
        .catch(function (error) {
          if (error) { alertWarn(error); }
        });
      }
    }

    // 新增子类节点
    $scope.addNewChildNode = function () {

      //防止多次调用该方法，无线添加medicalAttribute.parentCode
      if(!$scope.formData.medicalAttribute.id){
        return;
      }
      console.log($scope.formData.medicalAttribute.levelCode);
        var medicalAttribute={};
          medicalAttribute.parentId = $scope.formData.medicalAttribute.id;
          var parentCode=$scope.formData.medicalAttribute.parentCode;
          if(!parentCode)parentCode="";
          medicalAttribute.parentCode = angular.copy(parentCode + $scope.formData.medicalAttribute.levelCode);
          $scope.formData.medicalAttribute=medicalAttribute;

      // if ($scope.formData.medicalAttribute.levelCode && $scope.formData.medicalAttribute.showName) {
      //
      //   // 设置标识符
      //   $scope.modifyNodeInfo = false;
      //
      //   if (!$scope.formData.medicalAttribute.parentCode) {
      //     $scope.formData.medicalAttribute.parentCode = '';
      //   }
      //
      //   $scope.formData.medicalAttribute.parentCode = angular.copy($scope.formData.medicalAttribute.parentCode + $scope.formData.medicalAttribute.levelCode);
      //   $scope.formData.medicalAttribute.parentId = $scope.formData.medicalAttribute.id;
      //   $scope.formData.medicalAttribute.levelCode = null;
      //   $scope.formData.medicalAttribute.showName = null;
      // }
    }


  }

  angular.module('manageApp.project')
  .controller('medicalAttributeController', ['$scope',"alertOk",'alertError',"alertWarn", "requestData", "utils", medicalAttributeController]);
});
