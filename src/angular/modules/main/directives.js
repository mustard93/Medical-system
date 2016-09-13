/**
 * 主模块main 自定义指令集
 */

define('main/directives', ['main/init'], function () {
  angular.module('manageApp.main', [])
  /**
   * 清除模板缓存
   */
  .directive('ngView', ['$route', '$templateCache', '$routeParams', function ($route, $templateCache, $routeParams) {
    return {
        restrict: 'A',
        priority: -500,
        link: function ($scope, $element) {
            $templateCache.remove($route.current.loadedTemplateUrl);
            $scope.mainStatus.pageParams = $routeParams;
        }
    };
  }])
  /**
   * 转换日期
   */
  .directive('convertToDate', ['$filter', function (convertToDate) {
    var dateFilter = $filter('date');
    return {
        require: 'ngModel',
        link: function ($scope, $element, $attrs, ngModel) {
            var _format = $attrs.convertToDate ? $attrs.convertToDate : "yyyy-MM-dd";

            ngModel.$parsers.push(function (val) {
                return dateFilter(val, _format);
            });
            ngModel.$formatters.push(function () {
                return new Date(ngModel.$modelValue);
            });
        }
    };
  }])
  /**
   * 转换为数字
   */
  .directive('convertToNumber', [function (convertToNumber) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
  }])
  /**
   *  必填参数：attrs.ajaxUrl=""：请求数据参数
     可选参数：$attrs.ajaxUrlHandler :function(data) 指定回调方法
             $attrs.params  //监听具体值
             $attrs.scopeResponse ：返回数据Response是绑定到 $scope[$attrs.scopeResponse]
             $attrs.scopeData ：返回数据Response.data是绑定到 $scope[$attrs.scopeData]
             $attrs.scopeErrorMsg ：返回数据错误数据是否绑定到 $scope[$attrs.scopeErrorMsg]
             $attrs.alertOk :是否提示请求成功提示。
             $attrs.alertError :是否提示请求失败提示。

     请求返回数据格式：
            scopeResponse=  {
               "code": 200,
               "msg": "操作成功",
               "data": {
                 "id": "id1",
                 "name": "帐号1"
               }
             }
   */
  .directive('ajaxUrl', ['requestData', 'alertOk', 'alertError', function (requestData, alertOk, alertError) {
    return {
      restrict: 'AE',
      scope: true,
      transclude: true,
      link: function ($scope, $element, $attrs, $ctrls, $transclude) {
          $scope.isLoading = false;

          $transclude($scope, function (clone) {
              $element.append(clone);
          });

          $scope.ajaxUrlHandler = $scope.$eval($attrs.ajaxUrlHandler);
          // if($attrs.responseKey)$scope[$attrs.responseKey]={};
          var _params={};
          if ($attrs.params) {
              if ($attrs.params.indexOf("{") === 0) {
                  //监听具体值
                  $attrs.$observe("params", function (value) {
                    _params=$scope.$eval(value);
                      getData(_params);
                  });
              } else {
                  //监听对象
                  $scope.$watch($attrs.params, function (value) {
                      _params=value;
                      getData(_params);
                  }, true);
              }
          } else {
              $attrs.$observe("ajaxUrl", function (value) {
                  getData({});
              });
          }

          function getData(params) {
              $scope.isLoading = true;
              requestData($attrs.ajaxUrl, params)
                  .then(function (results) {
                      $scope.isLoading = false;
                      var data = results[0];
                      if ($scope.ajaxUrlHandler) {
                          data = $scope.ajaxUrlHandler(data);
                      }

                    if($attrs.scopeResponse) $scope[$attrs.scopeResponse] = results[1];
                    if($attrs.scopeData) $scope[$attrs.scopeData] = data;
                    else $scope.scopeData = data;
                    if(angular.isDefined($attrs.alertOk))alertOk(results[1].msg);

                    //回调父级的处理事件;
                    $scope.listCallback && $scope.listCallback(results[1]);
                  })
                  .catch(function (msg) {
                      if($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                      if(angular.isDefined($attrs.alertError)) alertError(msg);

                      $scope.isLoading = false;
                  });
          }

          $scope.$on("ajaxUrlReload", function () {
              getData(_detailsParams);
          });
      }
   };
}])
  /**
   * 表单验证
       必填参数：
       attrs.formValidator：
       attrs.action；请求数据参数
       可选参数：
       $attrs.ajaxUrlHandler :function(data) 指定回调方法
       $attrs.params  //监听具体值
       $attrs.scopeResponse ：返回数据Response是绑定到 $scope[$attrs.scopeResponse]
       $attrs.scopeData ：返回数据Response.data是绑定到 $scope[$attrs.scopeData]
       $attrs.scopeErrorMsg ：返回数据错误数据是否绑定到 $scope[$attrs.scopeErrorMsg]
       $attrs.broadcast ：是否发送广播
       $attrs.alertOk :是否提示请求成功提示。
       $attrs.alertError :是否提示请求失败提示。
       $attrs.autoCloseDialog：关闭弹出窗口

        if($attrs.formSubmitAfter=="reset"){
            DOMForm.reset(); //清空表格
        }else   if($attrs.formSubmitAfter=="donothing"){
            return;
        }

       请求返回数据格式：
         scopeResponse=  {
             "code": 200,
             "msg": "操作成功",
             "data": {
               "id": "id1",
               "name": "帐号1"
             }
           }
   */
  .directive('formValidator', ['requestData', 'modal', 'alertOk', 'alertError', function (requestData, modal, alertOk, alertError) {
    return {
        restrict: 'A',
        scope: true,
        link: function ($scope, $element, $attrs) {
            var formStatus = $scope.formStatus = {
                submitted: false,
                submitting: false,
                submitInfo: ""
            };
            var DOMForm = angular.element($element)[0];
            var scopeForm = $scope.$eval($attrs.name);
            var dialogData = $scope.ngDialogData;

            $scope.formData = angular.extend({}, $scope.formData);

            $scope.$watch($attrs.source, function (value) {
                if (value && angular.isObject(value)) {
                    angular.extend($scope.formData, value);
                }
            });

            $scope.reset = function () {
                DOMForm.reset();
            };

            $element.on("submit", function (e) {
                e.preventDefault();
                formStatus.submitting = true;
                requestData($attrs.action, $scope.formData,"POST")
                    .then(function (results) {
                        var data = results[0];
                        var data1 = results[1];
                        formStatus.submitting = false;
                        formStatus.submitInfo = "";

                        if($attrs.scopeResponse)$scope[$attrs.scopeResponse] = results[1];
                        if($attrs.scopeData)$scope[$attrs.scopeData] = data;

                         if(angular.isDefined($attrs.alertOk))alertOk(results[1].msg);

                         //重置表单
                         if($attrs.formSubmitAfter=="reset"){
                             DOMForm.reset();
                         }
                        if ($attrs.broadcast) {
                            $scope.$broadcast($attrs.broadcast);
                            $scope.$emit($attrs.broadcast);
                            if (angular.isDefined($attrs.autoCloseDialog)) {
                                modal.close();
                            }
                            return;
                        }

                        // 增加属性no-close-dialog设置不自动关闭模态框
                        if (angular.isDefined($attrs.noCloseDialog)) {
                            return;
                        }

                        if (data1 && data1.url) {
                            window.location.assign(data1.url);
                            return;
                        }

                        if (angular.isFunction($scope.submitCallBack)) {
                            $scope.submitCallBack.call($scope, dialogData, data);
                        } else if (data && data.url) {
                            window.location.assign(data.url);
                            // dialogAlert(data.message || '提交成功', function () {
                            //     window.location.assign(data.url);
                            // })
                        } else {
                            $scope.$broadcast("reloadList");
                        }
                        //自动关闭弹窗
                        angular.isDefined($attrs.autoCloseDialog) && modal.close();

                    })
                    .catch(function (error) {
                        formStatus.submitting = false;
                        formStatus.submitInfo = error || '提交失败。';
                        alertError(error);
                        //angular.isFunction($scope.submitCallBack) && $scope.submitCallBack.call($scope, dialogData, "");
                    });
            });
        }
    };
  }]);
  })
  /**
   * tableList
   */
  .directive('tableList', ['requestData', 'modal', 'dialogConfirm', '$timeout', function (requestData, modal, dialogConfirm, $timeout) {
    return {
        restrict: 'AE',
        scope: {
            listParams: "=?",
            listSelected: "=?",
            listSource: "=?"
        },
        transclude: true,
        require: "?^ngModel",
        link: function ($scope, $element, $attrs, ngModel, $transclude) {
            var statusInfo = {
                currentPage: 1,
                totalCount: 0,
                pageSize: 10,
                totalPage: 1,
                isFinished: false,
                isLoading: false
            };
            $scope.mainStatus = $scope.$parent.mainStatus;
            $scope.parent = $scope.$parent;
            $scope.status = statusInfo;
            $scope.listData = $attrs.listData;
            $scope.theadList = angular.fromJson($attrs.listThead);
            $scope.tbodyList = [];
            $scope.getListData = getListData;
            if (!angular.isDefined($scope.listParams)) {
                $scope.listParams = {};
            }
            if (!angular.isDefined($scope.listSelected)) {
                $scope.listSelected = [];
            }

            //批量删除
            $scope.delSelected = function (_url) {
                dialogConfirm('确定删除这些?', function () {
                    requestData(_url, {ids: $scope.listSelected.join(",")})
                        .then(function () {
                            $scope.$broadcast("reloadList");
                        })
                        .catch(function (error) {
                            alert(error || '删除错误');
                        });
                });
            };
            //单个删除
            $scope.deleteThis = function (_url) {
                var _tr = this.tr;
                dialogConfirm('确定删除?', function () {
                    requestData(_url, {id: _tr.id})
                        .then(function () {
                            $scope.tbodyList.splice($scope.tbodyList.indexOf(_tr), 1);
                            if ($scope.tbodyList.length === 0) {
                                $scope.$broadcast("reloadList");
                            }
                        })
                        .catch(function (error) {
                            alert(error || '删除错误');
                        });
                });
            };
            //选择当个
            $scope.selectThis = function () {
                var _tr = this.tr;
                var _index = $scope.tbodyList.indexOf(_tr);
                var $tr = $element.find("tbody tr");
                $tr.removeClass("on").eq(_index).addClass("on");
                ngModel && ngModel.$setViewValue(angular.copy(_tr));
            };
            //改变状态
            $scope.changeStatus = function (_url, _text) {
                var _tr = this.tr;
                dialogConfirm(_text || '确定?', function () {
                    requestData(_url, {id: _tr.id})
                        .then(function (results) {
                            var _data = results[0];
                            var _index = $scope.tbodyList.indexOf(_tr);
                            $scope.tbodyList[_index] = _data;
                        })
                        .catch(function (error) {
                            alert(error || '请求失败!');
                        });
                });
            };

            //弹窗修改后的回调
            $scope.submitCallBack = function (_curRow, _data) {
                modal.closeAll();
                if (_data && _curRow) { //修改
                    angular.forEach($scope.tbodyList, function (_row, _index) {
                        if (_row.id == _curRow.id) {
                            $scope.tbodyList[_index] = _data;
                        }
                    });
                } else {
                    $timeout(function () {
                        $scope.$broadcast("reloadList");
                    });
                }
            };

            var formData = {};

            function getListData(_callback) {
                if ($attrs.listSource) {
                    if ($scope.listSource) {
                        $scope.tbodyList = angular.isArray($scope.listSource) ? $scope.listSource : $scope.listSource.list;
                        if ($scope.listSource.options) {
                            statusInfo.totalCount = $scope.listSource.options.totalCount || statusInfo.totalCount;
                            statusInfo.pageSize = $scope.listSource.options.pageSize || statusInfo.pageSize;
                            statusInfo.totalPage = Math.ceil(statusInfo.totalCount / statusInfo.pageSize);
                        }
                        _callback && _callback();
                    }
                    return;
                }
                if (statusInfo.isLoading) {
                    return;
                }
                statusInfo.isLoading = true;
                requestData($attrs.listData, angular.merge({}, formData, {page: statusInfo.currentPage}))
                    .then(function (results) {
                        var data = results[1];
                        if (data.code == 200) {
                            if (data.options) {
                                statusInfo.totalCount = data.options.totalCount || statusInfo.totalCount;
                                statusInfo.pageSize = data.options.pageSize || statusInfo.pageSize;
                                statusInfo.totalPage = Math.ceil(statusInfo.totalCount / statusInfo.pageSize);
                            }

                            if (data.thead) {
                                $scope.theadList = data.thead;
                            }
            //自定义 tableList 增加 $scope.resultsData = data
             $scope.resultsData = data;


                        if (data.data && data.data.length > 0) {
                          $scope.tbodyList = data.data;
                        } else {
                          statusInfo.isFinished = true;
                        }
                          statusInfo.loadFailMsg = data.message;
                        } else {
                            statusInfo.isFinished = true;
                            statusInfo.loadFailMsg = data.message;
                        }
                        statusInfo.isLoading = false;
                        $timeout(bindSelectOneEvent);
                        _callback && _callback();
                    })
                    .catch(function () {
                        statusInfo.isLoading = false;
                        statusInfo.loadFailMsg = '加载出错';
                        _callback && _callback();
                    })
            };

            //设置值
            function setSelectedValue() {
                //listSelected
                var _checked = [];
                $scope.listSelected.length = 0;
                $(".selectOne:checked", $element).each(function () {
                    _checked.push(this.value);
                });
                [].unshift.apply($scope.listSelected, _checked);

                //ngModel
                var _selected = [];
                angular.forEach($scope.tbodyList, function (ls) {
                    angular.forEach($scope.listSelected, function (selected) {
                        if (ls.id == selected) {
                            _selected.push(ls);
                        }
                    })
                });
                ngModel && ngModel.$setViewValue(_selected);
            };
            //删除值
            $scope.$on("deleteSelected", function (event, selected) {
                $(".selectOne[value=" + selected.id + "]", $element).prop("checked", false);

                var _selectCount = $(".selectOne", $element).length;
                var _checkedCount = $(".selectOne:checked", $element).length;
                if (_checkedCount > 0 && _checkedCount < _selectCount) {
                    $(".selectAll", $element).prop("checked", false).get(0).indeterminate = true;
                } else if (_selectCount == _checkedCount) {
                    $(".selectAll", $element).prop("checked", true).get(0).indeterminate = false;
                } else {
                    $(".selectAll", $element).prop("checked", false).get(0).indeterminate = false;
                }

                var _checked = [];
                $scope.listSelected.length = 0;
                $(".selectOne:checked", $element).each(function () {
                    _checked.push(this.value);
                });
                [].unshift.apply($scope.listSelected, _checked);
                setSelectedValue();
            });

            //直接来自源
            $scope.$watchCollection("listSource", function (value) {
                if (value) {
                    getListData(setSelectedValue);
                }
            });

            //
            $scope.$watch("listParams", function () {
                statusInfo.currentPage = 1;
                statusInfo.isFinished = false;
                $scope.tbodyList = [];
                formData = angular.copy($scope.listParams);
                getListData(setSelectedValue);
                //清除选择框
                $(".selectAll", $element).length > 0 && ($(".selectAll", $element).prop("checked", false).get(0).indeterminate = false);
            }, true);

            $attrs.$observe("listData", function (value) {
                statusInfo.currentPage = 1;
                statusInfo.isFinished = false;
                $scope.tbodyList = [];
                formData = angular.copy($scope.listParams);
                getListData(setSelectedValue);
                //清除选择框
                $(".selectAll", $element).length > 0 && ($(".selectAll", $element).prop("checked", false).get(0).indeterminate = false);
            });

            //接受广播
            $scope.$on("reloadList", function () {
                statusInfo.currentPage = 1;
                statusInfo.isFinished = false;
                $scope.tbodyList = [];
                formData = angular.copy($scope.listParams);
                getListData(setSelectedValue);
                //清除选择框
                $(".selectAll", $element).length > 0 && ($(".selectAll", $element).prop("checked", false).get(0).indeterminate = false);
            });


            $($element)
            //全选
                .on("click", ".selectAll", function () {
                    if (this.indeterminate) {
                        this.checked = false;
                        $(".selectOne", $element).prop("checked", false);
                    } else {
                        $(".selectOne", $element).prop("checked", this.checked);
                    }

                    setSelectedValue();
                    $scope.$apply();
                });

            //选择单个
            function bindSelectOneEvent() {
                $(".selectOne", $element).on("click", function (e) {
                    e.stopPropagation();
                    var _selectCount = $(".selectOne", $element).length;
                    var _checkedCount = $(".selectOne:checked", $element).length;
                    if (_checkedCount > 0 && _checkedCount < _selectCount) {
                        $(".selectAll", $element).prop("checked", false).get(0).indeterminate = true;
                    } else if (_selectCount == _checkedCount) {
                        $(".selectAll", $element).prop("checked", true).get(0).indeterminate = false;
                    } else {
                        $(".selectAll", $element).prop("checked", false).get(0).indeterminate = false;
                    }

                    setSelectedValue();
                    $scope.$apply();
                });
            }

            $transclude($scope, function (clone) {
                $element.append(clone);
            });
        }
    };
  }]);
