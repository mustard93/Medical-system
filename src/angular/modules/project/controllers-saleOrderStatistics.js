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
  function orderStatisticsController ($scope, modal, alertWarn, alertError, alertOk, requestData, utils) {

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

    // 判断分组选择标识符，如果为false，则表示用户未选择任何一种分组标识
    $scope.groupFlag = true;

    // 初始化过滤字符串对象
    $scope.filterObject = {};
    // 加入默认值（年、月）  queryGroupEnum
    $scope.$watchCollection('tbodyList', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        if ($scope.tbodyList.length) {
          var tmpArr = $scope.tbodyList[0]['groupHeaderKey'].split('-').join();
          $scope.filterObject['queryGroupEnum'] = tmpArr;
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
      for (var key in $scope.filterObject) {
        if ($scope.filterObject.hasOwnProperty(key)) {
          $scope.listParams[key] = $scope.filterObject[key];
        }
      }

      modal.closeAll();
    }

    // 处理分组选中与取消选中事件
    $scope.handleGroupChoised = function (event, value) {

      if (event.currentTarget.checked) {    // 选中
        // 定义选择的分组集合
        var tmparr = [];

        if ($scope.filterObject.queryGroupEnum) {
          tmparr = $scope.filterObject.queryGroupEnum.split(',');
        }

        // 拼接queryGroupEnum字段值
        tmparr.push(value);

        // 判断分组集合是否不为空，若不为空，则更新标识
        if (tmparr.length !== 0) { $scope.groupFlag = true; }

      } else {
        // 定义选择的分组集合
        var tmparr = $scope.filterObject.queryGroupEnum.split(',');

        angular.forEach(tmparr, function (item, index) {
          if (item === value) { tmparr.splice(index, 1); }

          // 判断分组集合是否为空，若为空则标识用户未选择任何一种分组标识
          if (tmparr.length === 0) { $scope.groupFlag = false; }

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

  /**
   * [orderStatisticsGetDetailsController 销售统计表中侧边栏显示详情信息]
   * @method orderStatisticsGetDetailsController
   * @param  {[type]}                            $socpe      [description]
   * @param  {[type]}                            modal       [description]
   * @param  {[type]}                            alertWarn   [description]
   * @param  {[type]}                            alertError  [description]
   * @param  {[type]}                            alertOk     [description]
   * @param  {[type]}                            requestData [description]
   * @return {[type]}                                        [description]
   */
  function orderStatisticsGetDetailsController ($scope, modal, alertWarn, alertError, alertOk, requestData) {
    var keyData = $scope.dialogData.data;
    var _keyarr = keyData['groupKey'].split('-');

    $scope.listParams1 = {};

    angular.forEach(_keyarr, function (item, index) {
      $scope.listParams1[item] = keyData[item];

      // 循环查找对应的分组条件，将其ID写入参数对象中
      if (item === 'customerName') { $scope.listParams1['customerId'] = keyData['customerId']; }
      if (item === 'medicalAttributeName') { $scope.listParams1['medicalAttributeId'] = keyData['medicalAttributeId']; }
      if (item === 'medicalApprovedName') { $scope.listParams1['orderMedicalNoId'] = keyData['orderMedicalNoId']; }
      if (item === 'salesDepartmentName') { $scope.listParams1['salesDepartmentId'] = keyData['salesDepartmentId']; }
      if (item === 'saleUserName') { $scope.listParams1['saleUserId'] = keyData['saleUserId']; }
      if (item === 'departmentName') { $scope.listParams1['departmentId'] = keyData['departmentId']; }
      if (item === 'inputUserName') { $scope.listParams1['inputUserId'] = keyData['inputUserId']; }
    });

  }

  angular.module('manageApp.project')
  .controller('orderStatisticsController', ['$scope',"modal",'alertWarn',"alertError", "alertOk", "requestData", "utils", orderStatisticsController])
  .controller('orderStatisticsGetDetailsController', ['$scope',"modal",'alertWarn',"alertError", "alertOk", "requestData", orderStatisticsGetDetailsController]);
});
