define('project/controllers-orderStatistics', ['project/init'], function() {
  /**
   * [orderStatisticsController 销售、采购、消退、采退统计表控制器]
   * @method orderStatisticsController
   * @param  {[type]}                      $scope          [description]
   * @param  {[type]}                      modal           [description]
   * @param  {[type]}                      alertWarn       [description]
   * @param  {[type]}                      alertError      [description]
   * @param  {[type]}                      alertOk         [description]
   * @param  {[type]}                      requestData     [description]
   * @param  {[type]}                      watchFormChange [description]
   * @return {[type]}                                      [description]
   */
  function orderStatisticsController ($scope, modal, alertWarn, alertError, alertOk, requestData, watchFormChange) {

    // 定义参照数据集合
    var groupDataList = {
      "year": "年",
      "month": "月",
      "orderBusinessType": "业务类型",
      "salesType": "销售类型",
      "customerName": "客户",
      "medicalAttributeName": "商品分类",
      "medicalApprovedName": "商品",
      "salesDepartmentName": "业务部门",
      "saleUserName": "业务员",
      "departmentName": "制单部门",
      "inputUserName": "制单人"
    };

    // 初始化过滤字符串对象
    $scope.filterObject = {};
    // 加入默认值（年、月）  queryGroupEnum
    $scope.$watchCollection('tbodyList', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        if ($scope.tbodyList.length) {
          var tmpArr = $scope.tbodyList[0]['groupHeaderKey'].split('-').join();
          $scope.filterObject['queryGroupEnum'] = tmpArr
        }
      }
    });


    $scope.groupData = [];

    // 侧边栏选择分组时判断是否已选中
    $scope.judgeHasThisItem = function (tbodyList, value) {
      return tbodyList[0]['groupHeaderKey'].split('-').indexOf(value) > -1 ? true : false;
    }

    $scope.initTableTbodyModal = function (tbodyList) {
      // 获取groupKey
      var _groupKey = tbodyList[0]['groupKey'];
      var _groupKeyArray = _groupKey.split('-');
      // 循环遍历当前数组值并与groupDataList进行比对，将得出的值push进groupList中
      angular.forEach(_groupKeyArray, function (data, index) {
        for(var key in groupDataList) {
          if (groupDataList.hasOwnProperty(key) && (data === key)) {
            $scope.groupList.push(groupDataList[key]);
          }
        }
      });
      // console.log($scope.groupList);
    }

    // 处理用户查询中类型变更事件
    $scope.handleTypeChange = function () {
      // 将对象filterObject赋值给listParams
      $scope.listParams = angular.copy($scope.filterObject);
      var _reqUrl = 'rest/authen/saleOrderStatistics/query.json';
      requestData(_reqUrl, $scope.listParams)
      .then(function (results) {
        $scope.tbodyList = results[1].data;
      })
      .catch(function (err) {
        throw new Error(err || '出错');
      });


      modal.closeAll();
    }

    // 处理分组选中与取消选中事件
    $scope.handleGroupChoised = function (event, value) {

      var tmparr = $scope.filterObject.queryGroupEnum.split(',');

      if (event.currentTarget.checked) {    // 选中
        tmparr.push(value);    // 拼接queryGroupEnum字段值
      } else {
        angular.forEach(tmparr, function (item, index) {
          if (item === value) { tmparr.splice(index, 1); }
        });
      }

      $scope.filterObject.queryGroupEnum = tmparr.join();
    }

    // 查看详情回调方法
    $scope.handleThisItemData = function (data) {
      // 定义当前侧边栏的数据对象
      $scope.dataDetailsList = {};

      // data-当前点击行的数据对象
      var _keyarr = data['groupKey'].split('-');
      angular.forEach(_keyarr, function (item, index) {
        $scope.dataDetailsList[item] = data[item];

        // 循环查找对应的分组条件，将其ID写入参数对象中
        if (item === 'customerName') { $scope.dataDetailsList['customerId'] = data['customerId']; }
        if (item === 'medicalAttributeName') { $scope.dataDetailsList['medicalAttributeId'] = data['medicalAttributeId']; }
        if (item === 'medicalApprovedName') { $scope.dataDetailsList['orderMedicalNoId'] = data['orderMedicalNoId']; }
        if (item === 'salesDepartmentName') { $scope.dataDetailsList['salesDepartmentId'] = data['salesDepartmentId']; }
        if (item === 'saleUserName') { $scope.dataDetailsList['saleUserId'] = data['saleUserId']; }
        if (item === 'departmentName') { $scope.dataDetailsList['departmentId'] = data['departmentId']; }
        if (item === 'inputUserName') { $scope.dataDetailsList['inputUserId'] = data['inputUserId']; }
      });

      if ($scope.listParams) {
        for (var key in $scope.listParams) {
          if ($scope.listParams.hasOwnProperty(key) && $scope.listParams[key]) {
            $scope.dataDetailsList[key] = $scope.listParams[key];
          }
        }
      }

      console.log(data);

      // if (data['confirmOrderId']) { $scope.dataDetailsList['confirmOrderId'] = data['confirmOrderId']; }
      // if (data['customerId']) { $scope.dataDetailsList['customerId'] = data['customerId']; }
      // if (data['departmentId']) { $scope.dataDetailsList['departmentId'] = data['departmentId']; }
      // if (data['inputUserId']) { $scope.dataDetailsList['inputUserId'] = data['inputUserId']; }
      // if (data['medicalAttributeId']) { $scope.dataDetailsList['medicalAttributeId'] = data['medicalAttributeId']; }
      // if (data['orderMedicalNoId']) { $scope.dataDetailsList['orderMedicalNoId'] = data['orderMedicalNoId']; }
      // if (data['saleUserId']) { $scope.dataDetailsList['saleUserId'] = data['saleUserId']; }
      // if (data['salesDepartmentId']) { $scope.dataDetailsList['salesDepartmentId'] = data['salesDepartmentId']; }

      var _reqUrl = 'rest/authen/saleOrderStatistics/getSaleOrderStatisticsList';
      requestData(_reqUrl, $scope.dataDetailsList)
      .then(function (results) {
        $scope.detailsDataList = results[1].data;
      })
      .catch(function (err) {
        throw new Error(err);
      });

    }

  }

  angular.module('manageApp.project')
  .controller('orderStatisticsController', ['$scope',"modal",'alertWarn',"alertError", "alertOk", "requestData", "watchFormChange", orderStatisticsController]);
});
