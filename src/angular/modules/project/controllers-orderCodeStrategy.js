define('project/controllers-orderCodeStrategy', ['project/init'], function() {
  /**
   * [orderCodeStrategyController 单据编号策略模块控制器]
   * @method orderCodeStrategyController
   * @param  {[type]}                    $scope      [description]
   * @param  {[type]}                    alertOk     [description]
   * @param  {[type]}                    alertError  [description]
   * @param  {[type]}                    requestData [description]
   * @return {[type]}                                [description]
   */
  function orderCodeStrategyController ($scope, alertOk, alertError, requestData) {

    // 编码样例
    $scope.codeSample = null;

    // 编码长度溢出标识符
    $scope.codeLengthOverflow = false;

    // 定义单据编号前缀数据模型
    $scope.codePrefixList = [
      {"text": "静态文本", "value": "静态文本"},
      {"text": "单据日期", "value": "单据日期"}
    ];

    // 初始化单据编号前缀模型
    $scope.prefix1_list = angular.copy($scope.codePrefixList);
    $scope.prefix2_list = angular.copy($scope.codePrefixList);

    // 初始化日期类型前缀模型
    $scope.dateTypeList = [
      {"text":"年", "value":"年"},
      {"text":"年月", "value":"年月"},
      {"text":"年月日", "value":"年月日"}
    ];

    // 年月日生成前缀2
    $scope.createPrefixForDate = function (type) {
      var _text = null, _t = new Date();

      // 为月和日期加上前缀0
      function addPrefix0 (data) {
        if (data < 10) { return '0' + data; }
      }

      switch (type) {
        case '年': _text = '' + _t.getFullYear(); break;
        case '年月': _text = '' + _t.getFullYear() + addPrefix0((_t.getMonth() + 1)); ; break;
        case '年月日': _text = '' + _t.getFullYear() + addPrefix0((_t.getMonth() + 1)) + addPrefix0(_t.getDay()); break;
      }

      $scope.fixDateString = _text;

      return _text;
    };

    // 计算编码字符长度
    $scope.getCodeLength = function (formData) {

      if (Number(formData.type) === 1) {
        var _prefix1Length = 0, _prefix2Length = 0;

        if (formData.prefix1) {
          if (formData.prefix1 === '年' || formData.prefix1 === '年月' || formData.prefix1 === '年月日') {
            _prefix1Length = $scope.createPrefixForDate($scope.formData.prefix1).length;
          } else {
            _prefix1Length = $scope.formData.prefix1.length;
          }
        }

        if (formData.prefix2) {
          if (formData.prefix2 === '年' || formData.prefix2 === '年月' || formData.prefix2 === '年月日') {
            _prefix2Length = $scope.createPrefixForDate($scope.formData.prefix2).length;
          } else {
            _prefix2Length = $scope.formData.prefix2.length;
          }
        }

        $scope.codeLength = _prefix1Length + _prefix2Length + Number(formData.serialNumberLength);

      }

      // $scope.codeLength = Number(formData.prefix1.length) + Number($scope.fixDateString.length) + Number(formData.serialNumberLength);

      // if (formData.prefix1_type === '静态文本' && formData.prefix2) {
      //   $scope.createPrefixForDate(formData.prefix2);
      //   if ($scope.fixDateString) {
      //     $scope.codeLength = Number(formData.prefix1.length) + Number($scope.fixDateString.length) + Number(formData.serialNumberLength);
      //   }
      // }
      //
      // if (formData.prefix2_type === '静态文本' && formData.prefix1) {
      //   $scope.createPrefixForDate(formData.prefix1);
      //   if ($scope.fixDateString) {
      //     $scope.codeLength = Number(formData.prefix2.length) + Number($scope.fixDateString.length) + Number(formData.serialNumberLength);
      //   }
      // }
    }

    // 创建编码样例
    $scope.createCodeSample = function (formData) {

      if (Number(formData.type) === 1) {
        // 构建字符串
        var _prefix1 = '', _prefix2 = '', _serialNumber;

        // 构建流水号
        var _tmp = formData.serialNumberLength - 1;
        _serialNumber = 1;
        for (var i = 0; i < _tmp; i ++) {
          _serialNumber += '0';
        }

        if (formData.prefix1) {
          if (formData.prefix1 === '年' || formData.prefix1 === '年月' || formData.prefix1 === '年月日') {
            _prefix1 = $scope.createPrefixForDate($scope.formData.prefix1)
          } else {
            _prefix1 = formData.prefix1;
          }
        } else {
          _prefix1 = '';
        }

        if (formData.prefix2) {
          if (formData.prefix2 === '年' || formData.prefix2 === '年月' || formData.prefix2 === '年月日') {
            _prefix2 = $scope.createPrefixForDate($scope.formData.prefix2)
          } else {
            _prefix2 = formData.prefix2;
          }
        } else {
          _prefix2 = '';
        }

        $scope.codeSample = _prefix1 + _prefix2 + _serialNumber;

      }

    }

    // 树形菜单中选项被点击后，监控medicalAttribute对象变化，并获取响应数据重新渲染右侧表单内容
    $scope.$watchCollection('formData.medicalAttribute', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        // 用户点击了树中不同节点，请求当前节点的信息
        var _nodeName = 'DT_' + newVal['name'];
        //判断是否显示完全手工编号选项
        if(newVal['name'] == '发货单' || newVal['name'] == '来货通知单') $scope.manualNumber = true;
        else $scope.manualNumber = false;
        var _reqUrl = 'rest/authen/orderCodeStrategy/get?moduleType=' + _nodeName;
        requestData(_reqUrl)
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.formData = results[1].data;  // 新获取的模块配置数据赋值给当前表单数据对象

            // 如果类型类空，则初始化为1（系统自动生成）
            if (!$scope.formData.type) { $scope.formData.type = 1; }

            // 如果类型为空，则赋值为当前类型
            if (!$scope.formData.moduleType) { $scope.formData.moduleType = _nodeName; }

            // 初始化样例
            $scope.codeSample = null;

            // 初始化获取编码长度和样例
            $scope.getCodeLength($scope.formData);
            $scope.createCodeSample($scope.formData);
          }
        })
        .catch(function (error) {
          if (error) { throw new Error(error || '出错'); }
        })
      }
    });

    // ...
    $scope.clearSetOptions = function () {
      if (Number($scope.formData.type) === 2) {
        $scope.formData.prefix1_type = $scope.formData.prefix2_type = '';
        $scope.formData.prefix1 = $scope.formData.prefix2 = '';
        $scope.formData.serialNumberLength = null;
        $scope.codeLength = null;
        $scope.codeSample = null;
      }
    }
  }

  angular.module('manageApp.project')
  .controller('orderCodeStrategyController', ['$scope',"alertOk",'alertError',"requestData", orderCodeStrategyController]);
});
