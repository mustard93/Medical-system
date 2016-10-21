/**
 * Created by hao on 15/11/5.
 */

define('main/directives', ['main/init'], function() {

    /**
     * Clear ng-view template cache
     */
    function ngView($route, $templateCache, $routeParams) {
        return {
            restrict: 'A',
            priority: -500,
            link: function($scope, $element) {
                $templateCache.remove($route.current.loadedTemplateUrl);
                $scope.mainStatus.pageParams = $routeParams;
            }
        };
    }


    /**
     * 转换日期
     */
    function convertToDate($filter) {
        var dateFilter = $filter('date');
        return {
            require: 'ngModel',
            link: function($scope, $element, $attrs, ngModel) {
                var _format = $attrs.convertToDate ? $attrs.convertToDate : "yyyy-MM-dd";

                ngModel.$parsers.push(function(val) {
                    if (!val) return;


                    if ($attrs.format) {
                        return dateFilter(val, _format);
                    } else {
                        return val.getTime();

                    }
                });

                ngModel.$formatters.push(function() {
                    if (!ngModel.$modelValue) return null;
                    if ($attrs.timestamp) {
                        return new Date(ngModel.$modelValue).getTime();
                    } else {
                        return new Date(ngModel.$modelValue);
                    }
                });
            }
        };
    }
    convertToDate.$inject = ['$filter'];

    /**
     * 转换为数字
     */
    function convertToNumber() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(val) {
                    return parseInt(val, 10);
                });
                ngModel.$formatters.push(function(val) {
                    return '' + val;
                });
            }
        };
    }
    convertToNumber.$inject = [];

    /**
     * JSON转换为
     */
    function convertJsonToObject() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(val) {
                    if (!val) return null;
                    return angular.fromJson(val);
                });
                ngModel.$formatters.push(function(val) {
                    return angular.toJson(val);
                });
            }
        };
    }
    convertJsonToObject.$inject = [];

    /**
    必填参数：
    attrs.ajaxUrl=""：请求数据参数
    可选参数：
    $attrs.ajaxUrlHandler :function(data) 指定回调方法
    $attrs.params  //监听具体值
    $attrs.scopeResponse ：返回数据Response是绑定到 $scope[$attrs.scopeResponse]
    $attrs.scopeData ：返回数据Response.data是绑定到 $scope[$attrs.scopeData]
    $attrs.scopeErrorMsg ：返回数据错误数据是否绑定到 $scope[$attrs.scopeErrorMsg]
    $attrs.alertOk :是否提示请求成功提示。
    $attrs.alertError :是否提示请求失败提示。
    $attrs.ajaxIf :满足条件才异步请求  ajax-if="{{addDataItem.relId}}"

    $attrs.callback:满足条件才异步请求 回调方法。比如 callback="formData={}"

$attrs.callback:异步加载 成功后，回调执行代码行。作用域$scope， callback="formData.courseId=details[0].value"
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
     function ajaxUrl($timeout, requestData, alertOk, alertError, proLoading) {
         return {
             restrict: 'AE',
             // scope: true,
             transclude: true,
             link: function($scope, $element, $attrs, $ctrls, $transclude) {
                 $transclude($scope, function(clone) {
                     $element.append(clone);
                 });

                 $scope.ajaxUrlHandler = $scope.$eval($attrs.ajaxUrlHandler);
                 // if($attrs.responseKey)$scope[$attrs.responseKey]={};
                 var _params = {};
                 if ($attrs.params) {
                     if ($attrs.params.indexOf("{") === 0) {
                         //监听具体值
                         $attrs.$observe("params", function(value) {
                             _params = $scope.$eval(value);
                             getData(_params);
                         });
                     } else {
                         //监听对象
                         $scope.$watch($attrs.params, function(value) {
                             _params = value;
                             getData(_params);
                         }, true);
                     }
                 } else {
                     $attrs.$observe("ajaxUrl", function(value) {
                         getData({});
                     });
                 }



                //  if ($attrs.showLoading) {
                //    proLoading($element, $scope, 'showLoading', {});
                //    $scope.$watch($scope.isLoading, function () {
                //      $('.pr-full-loading').remove();
                //    });
                //  }

                 function getData(params) {
                    //满足条件才异步请求
                    if (angular.isDefined($attrs.ajaxIf)) {
                      if (!$attrs.ajaxIf) return;
                    }

                    $scope.isLoading = true;

                    if ($attrs.showLoading) {
                      proLoading($element, $scope, 'showLoading', {});
                      // $scope.$watch($scope.isLoading, function () {
                      //   $('.pr-full-loading').remove();
                      // });
                    }

                    requestData($attrs.ajaxUrl, params)
                      .then(function(results) {
                          var data = results[0];

                          if ($scope.ajaxUrlHandler) {
                              data = $scope.ajaxUrlHandler(data);
                          }

                          if ($attrs.scopeResponse) $scope[$attrs.scopeResponse] = results[1];
                          if ($attrs.scopeData) $scope[$attrs.scopeData] = data;
                          else $scope.scopeData = data;
                          if (angular.isDefined($attrs.alertOk)) alertOk(results[1].msg);

                          //回调父级的处理事件;
                          if ($scope.listCallback) {
                            $scope.listCallback(results[1]);
                          }

                          // $scope.$apply();
                          if ($attrs.callback) {
                              $scope.$eval($attrs.callback);
                          }

                          $('.pr-full-loading').remove();
                          $scope.isLoading = false;
                      })
                      .catch(function(msg) {
                         if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                         if (angular.isDefined($attrs.alertError)) alertError(msg);
                         $('.pr-full-loading').remove();
                      });

                 }

                 $scope.$on("ajaxUrlReload", function() {
                     getData(_detailsParams);
                 });
             }
         };
     }

    /**
 表单验证
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
    function formValidator(requestData, modal, alertOk, alertError,dialogConfirm) {
        return {
            restrict: 'A',
            // scope: true,
            link: function($scope, $element, $attrs) {
                var formStatus = $scope.formStatus = {
                    submitted: false,
                    submitting: false,
                    submitInfo: ""
                };
                var DOMForm = angular.element($element)[0];
                var scopeForm = $scope.$eval($attrs.name);
                var dialogData = $scope.ngDialogData;

                $scope.formData = angular.extend({}, $scope.formData);

                $scope.$watch($attrs.source, function(value) {
                    if (value && angular.isObject(value)) {
                        angular.extend($scope.formData, value);
                    }
                });

                $scope.reset = function() {
                    DOMForm.reset();
                };



                                    function ajax_submit(){
                                      if(formStatus.submitting == true)return;
                                      formStatus.submitting = true;

                                      var parameterBody = false;
                                      if (angular.isDefined($attrs.parameterBody)) parameterBody = true;

                                      requestData($attrs.action, $scope.formData, "POST", parameterBody)
                                          .then(function(results) {
                                              var data = results[0];
                                              var data1 = results[1];
                                              formStatus.submitting = false;
                                              formStatus.submitInfo = "";

                                              if ($attrs.scopeResponse) $scope[$attrs.scopeResponse] = results[1];
                                              if ($attrs.scopeData) $scope[$attrs.scopeData] = data;

                                              if (angular.isDefined($attrs.alertOk)) alertOk(results[1].msg);

                                              //重置表单
                                              if ($attrs.formSubmitAfter == "reset") {
                                                  DOMForm.reset();
                                              }

                                              if ($attrs.callback) {
                                                  $scope.$eval($attrs.callback);
                                              }

                                              if ($attrs.broadcast) {
                                                  $scope.$broadcast($attrs.broadcast);
                                                  $scope.$emit($attrs.broadcast);
                                                  // if (angular.isDefined($attrs.autoCloseDialog)) {
                                                  //     modal.close();
                                                  // }
                                                  // return;
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
                                          .catch(function(error) {
                                              formStatus.submitting = false;
                                              formStatus.submitInfo = error || '提交失败。';


                                              alertError(error);
                                              //angular.isFunction($scope.submitCallBack) && $scope.submitCallBack.call($scope, dialogData, "");
                                          });
                                    }//end ajax_submit

                $element.on("submit", function(e) {
                    e.preventDefault();

                    if($attrs.beforeConfirmMsg){

                      dialogConfirm($attrs.beforeConfirmMsg, function () {
                        ajax_submit();
                      }, null);
                    }else{
                        ajax_submit();
                    }




                });
            }
        };
    }

    /**
     * 表格
     */
    function tableList(requestData, modal, dialogConfirm, $timeout, proLoading) {
        return {
            restrict: 'AE',
            scope: {
                listParams: "=?",
                listSelected: "=?",
                listSource: "=?"
            },
            transclude: true,
            require: "?^ngModel",
            link: function($scope, $element, $attrs, ngModel, $transclude) {
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
                $scope.delSelected = function(_url) {
                    dialogConfirm('确定删除这些?', function() {
                        requestData(_url, {
                                ids: $scope.listSelected.join(",")
                            })
                            .then(function() {
                                $scope.$broadcast("reloadList");
                            })
                            .catch(function(error) {
                                alert(error || '删除错误');
                            });
                    });
                };
                //单个删除
                $scope.deleteThis = function(_url, _param) {
                    var _tr = this.tr;
                    dialogConfirm('确定删除?', function() {
                        requestData(_url, {
                                id: _param
                            }, 'POST')
                            .then(function() {
                                $scope.tbodyList.splice($scope.tbodyList.indexOf(_tr), 1);
                                if ($scope.tbodyList.length === 0) {
                                    $scope.$broadcast("reloadList");
                                }
                            })
                            .catch(function(error) {
                                alert(error || '删除错误');
                            });
                    });
                };
                //单个操作
                $scope.dothing = function(_url, _param,tip) {
                    var _tr = this.tr;
                    dialogConfirm(tip, function() {
                        requestData(_url, _param, 'POST')
                            .then(function() {
                                $scope.tbodyList.splice($scope.tbodyList.indexOf(_tr), 1);
                                if ($scope.tbodyList.length !== 0) {
                                    $scope.$broadcast("reloadList");
                                }
                            })
                            .catch(function(error) {
                                alert(error || '删除错误');
                            });
                    });
                };
                //选择单个
                $scope.selectThis = function() {
                    var _tr = this.tr;
                    var _index = $scope.tbodyList.indexOf(_tr);
                    var $tr = $element.find("tbody tr");
                    $tr.removeClass("on").eq(_index).addClass("on");
                    if (ngModel) {
                        ngModel.$setViewValue(angular.copy(_tr));
                    }
                };
                //改变状态
                $scope.changeStatus = function(_url, _text) {
                    var _tr = this.tr;
                    dialogConfirm(_text || '确定?', function() {
                        requestData(_url, {
                                id: _tr.id
                            })
                            .then(function(results) {
                                var _data = results[0];
                                var _index = $scope.tbodyList.indexOf(_tr);
                                $scope.tbodyList[_index] = _data;
                            })
                            .catch(function(error) {
                                alert(error || '请求失败!');
                            });
                    });
                };
                //弹窗修改后的回调
                $scope.submitCallBack = function(_curRow, _data) {
                    modal.closeAll();
                    if (_data && _curRow) { //修改
                        angular.forEach($scope.tbodyList, function(_row, _index) {
                            if (_row.id == _curRow.id) {
                                $scope.tbodyList[_index] = _data;
                            }
                        });
                    } else {
                        $timeout(function() {
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
                            if (_callback) {
                                _callback();
                            }
                        }
                        return;
                    }

                    //满足条件才异步请求
                    if (angular.isDefined($attrs.ajaxIf)) {
                        if (!$attrs.ajaxIf) return;
                    }

                    if (statusInfo.isLoading) {
                        return;
                    }
                    statusInfo.isLoading = true;

                    $scope.isLoading = statusInfo.isLoading;

                    proLoading($element, $scope, 'showLoading', {});

                    requestData($attrs.listData, angular.merge({}, formData, {
                            pageNo: statusInfo.currentPage
                        }))
                        .then(function(results) {
                            var data = results[1];
                            if (data.code == 200) {
                                statusInfo.totalCount = data.totalCount;
                                statusInfo.pageSize = data.pageSize;

                                if (statusInfo.totalCount && statusInfo.pageSize) {
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
                            $scope.isLoading = false;
                            $timeout(bindSelectOneEvent);
                            if (_callback) {
                                _callback();
                            }
                        })
                        .catch(function() {
                            statusInfo.isLoading = false;
                            $scope.isLoading = false;
                            statusInfo.loadFailMsg = '加载出错';
                            if (_callback) {
                                _callback();
                            }
                        });
                }

                //设置值
                function setSelectedValue() {
                    //listSelected
                    var _checked = [];
                    $scope.listSelected.length = 0;
                    $(".selectOne:checked", $element).each(function() {
                        _checked.push(this.value);
                    });
                    [].unshift.apply($scope.listSelected, _checked);

                    //ngModel
                    var _selected = [];
                    angular.forEach($scope.tbodyList, function(ls) {
                        angular.forEach($scope.listSelected, function(selected) {
                            if (ls.id == selected) {
                                _selected.push(ls);
                            }
                        });
                    });
                    if (ngModel) {
                        ngModel.$setViewValue(_selected);
                    }
                }
                //删除值
                $scope.$on("deleteSelected", function(event, selected) {
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
                    $(".selectOne:checked", $element).each(function() {
                        _checked.push(this.value);
                    });
                    [].unshift.apply($scope.listSelected, _checked);
                    setSelectedValue();
                });
                //直接来自源
                $scope.$watchCollection("listSource", function(value) {
                    if (value) {
                        getListData(setSelectedValue);
                    }
                });
                //监视参数变化
                $scope.$watch("listParams", function() {
                    statusInfo.currentPage = 1;
                    statusInfo.isFinished = false;
                    $scope.tbodyList = [];
                    formData = angular.copy($scope.listParams);

                    if (formData.q) {
                      formData.q = "(?i)" + formData.q;
                    }

                    getListData(setSelectedValue);
                    //清除选择框
                    if ($(".selectAll", $element).length > 0) {
                        $(".selectAll", $element).prop("checked", false).get(0).indeterminate = false;
                    }
                }, true);
                //监视请求源地址变化
                $attrs.$observe("listData", function(value) {
                    statusInfo.currentPage = 1;
                    statusInfo.isFinished = false;
                    $scope.tbodyList = [];
                    formData = angular.copy($scope.listParams);
                    getListData(setSelectedValue);
                    //清除选择框
                    if ($(".selectAll", $element).length > 0) {
                        $(".selectAll", $element).prop("checked", false).get(0).indeterminate = false;
                    }
                });
                //接受广播
                $scope.$on("reloadList", function() {
                    statusInfo.currentPage = 1;
                    statusInfo.isFinished = false;
                    $scope.tbodyList = [];
                    formData = angular.copy($scope.listParams);
                    getListData(setSelectedValue);
                    //清除选择框
                    if ($(".selectAll", $element).length > 0) {
                        $(".selectAll", $element).prop("checked", false).get(0).indeterminate = false;
                    }
                });

                $($element)
                    //全选
                    .on("click", ".selectAll", function() {
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
                    $(".selectOne", $element).on("click", function(e) {
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

                $transclude($scope, function(clone) {
                    $element.append(clone);
                });
            }
        };
    }
    tableList.$inject = ['requestData', 'modal', 'dialogConfirm', '$timeout', 'proLoading'];

    /**
     * 表格 单元格
     */
    function tableCell() {
        return {
            restrict: 'AE',
            scope: {
                row: "="
            },
            replace: true,
            templateUrl: Config.tplPath + 'tpl/table-cell.html',
            link: function($scope, $element, $attrs) {
                $scope.cells = [];
                if (angular.isString($scope.row) || angular.isNumber($scope.row)) {
                    $scope.cells.push({
                        text: $scope.row
                    });
                } else if (angular.isArray($scope.row)) {
                    angular.forEach($scope.row, function(_value) {
                        if (angular.isObject(_value)) {
                            $scope.cells.push(_value);
                        } else {
                            $scope.cells.push({
                                text: _value
                            });
                        }
                    });
                } else {
                    $scope.cells.push($scope.row);
                }
            }
        };
    }

    /**
     * 分页
     */
    function pagination() {
        return {
            restrict: 'AE',
            scope: true,
            replace: true,
            templateUrl: Config.tplPath + 'tpl/pagination.html',
            link: function($scope, $element, $attrs) {
                var maxSize = angular.isDefined($attrs.maxSize) ? $scope.$parent.$eval($attrs.maxSize) : 10,
                    rotate = angular.isDefined($attrs.rotate) ? $scope.$parent.$eval($attrs.rotate) : true;

                $scope.start = function() {
                    if ($scope.status.currentPage == 1) {
                        return;
                    }
                    $scope.status.currentPage = 1;
                    $scope.getListData();
                };
                $scope.prev = function() {
                    if ($scope.status.currentPage <= 1) {
                        return;
                    }
                    $scope.status.currentPage--;
                    $scope.getListData();
                };
                $scope.next = function() {
                    if ($scope.status.currentPage >= $scope.status.totalPage) {
                        return;
                    }
                    $scope.status.currentPage++;
                    $scope.getListData();
                };
                $scope.end = function() {
                    if ($scope.status.currentPage == $scope.status.totalPage) {
                        return;
                    }
                    $scope.status.currentPage = $scope.status.totalPage;
                    $scope.getListData();
                };
                $scope.goto = function(_page) {
                    $scope.status.currentPage = _page;
                    $scope.getListData();
                };

                $scope.$watch("status.totalPage", function() {
                    $scope.pages = getPages($scope.status.currentPage, $scope.status.totalPage);
                });
                $scope.$watch("status.currentPage", function() {
                    $scope.pages = getPages($scope.status.currentPage, $scope.status.totalPage);
                });

                function makePage(number, text, isActive) {
                    return {
                        number: number,
                        text: text,
                        active: isActive
                    };
                }

                function getPages(currentPage, totalPages) {
                    var pages = [];

                    // Default page limits
                    var startPage = 1,
                        endPage = totalPages;
                    var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

                    // recompute if maxSize
                    if (isMaxSized) {
                        if (rotate) {
                            // Current page is displayed in the middle of the visible ones
                            startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                            endPage = startPage + maxSize - 1;

                            // Adjust if limit is exceeded
                            if (endPage > totalPages) {
                                endPage = totalPages;
                                startPage = endPage - maxSize + 1;
                            }
                        } else {
                            // Visible pages are paginated with maxSize
                            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

                            // Adjust last page if limit is exceeded
                            endPage = Math.min(startPage + maxSize - 1, totalPages);
                        }
                    }

                    // Add page number links
                    for (var number = startPage; number <= endPage; number++) {
                        var page = makePage(number, number, number === currentPage);
                        pages.push(page);
                    }

                    // Add links to move between page sets
                    if (isMaxSized && !rotate) {
                        if (startPage > 1) {
                            var previousPageSet = makePage(startPage - 1, '...', false);
                            pages.unshift(previousPageSet);
                        }

                        if (endPage < totalPages) {
                            var nextPageSet = makePage(endPage + 1, '...', false);
                            pages.push(nextPageSet);
                        }
                    }

                    return pages;
                }
            }
        };
    }

    /**
     * 分页2
     */
    function pagination2() {
        return {
            restrict: 'AE',
            scope: true,
            replace: true,
            templateUrl: Config.tplPath + 'tpl/pagination2.html',
            link: function($scope, $element, $attrs) {
                $scope.start = function() {
                    if ($scope.status.currentPage == 1) {
                        return;
                    }
                    $scope.status.currentPage = 1;
                    $scope.getListData();
                };
                $scope.prev = function() {
                    if ($scope.status.currentPage <= 1) {
                        return;
                    }
                    $scope.status.currentPage--;
                    $scope.getListData();
                };
                $scope.next = function() {
                    if ($scope.status.currentPage >= $scope.status.totalPage) {
                        return;
                    }
                    $scope.status.currentPage++;
                    $scope.getListData();
                };
                $scope.end = function() {
                    if ($scope.status.currentPage == $scope.status.totalPage) {
                        return;
                    }
                    $scope.status.currentPage = $scope.status.totalPage;
                    $scope.getListData();
                };
            }
        };
    }

    /**
     * 筛选
     */
    function filterConditions(requestData) {
        return {
            restrict: 'AE',
            scope: {},
            transclude: true,
            link: function($scope, $element, $attrs, $ctrls, $transclude) {
                //筛选
                //var listParams = $scope.$eval($attrs.ngModel);
                $scope.filterParams = {};
                $scope.filterConditions = {
                    list: []
                };
                var filterConditions = $scope.filterConditions;
                $scope.conditionList = {};

                $scope.selectCondition = function(_name, _item) {
                    _item.type = _name;
                    filterConditions[_name] = _item;
                    filterConditions.list.push(_item);
                    updataListParams();
                };

                $scope.deleteCondition = function(_this) {
                    var _index = filterConditions.list.indexOf(_this);
                    filterConditions.list.splice(_index, 1);
                    delete filterConditions[_this.type];
                    updataListParams();
                };

                //
                function updataListParams() {
                    var _data = {};
                    angular.forEach($scope.filterConditions.list, function(condition) {
                        _data[condition.type] = condition.id;
                    });
                    $scope.filterParams = _data;
                }

                //获取筛选条件
                if ($attrs.filterConditions) {
                    (function() {
                        requestData($attrs.filterConditions)
                            .then(function(results) {
                                var _data = results[0];
                                $scope.conditionList = _data;
                            });
                    })();
                }

                $transclude($scope, function(clone) {
                    $element.append(clone);
                });
            }
        }
    };
    filterConditions.$inject = ["requestData"];

    /**
     * 树状列表
     */
    function treeList(buildTree,requestData, $timeout) {
        return {
            restrict: 'AE',
            scope: {},
            require: "?^ngModel",
            templateUrl: Config.tplPath + 'tpl/tree.html',
            link: function($scope, $element, $attrs, ngModel) {
                var isFirstLoad = true;
                $scope.status = {};
                $scope.treeList = [];
                $scope.curTree = {};
                $scope.status.isLoading = true;

                $scope.selectTree = function(tree, e) {
                    var $li = $element.find("li");
                    var $em = $(e.currentTarget);
                    var $parentLi = $em.parent("li");
                    var _tree = angular.copy(tree);
                    if (_tree.nodes.length == 0) {
                        $li.removeClass("on");
                        $parentLi.addClass("on");
                        ngModel && ngModel.$setViewValue(_tree);
                    } else {
                        if ($parentLi.hasClass("fold")) {
                            $parentLi.removeClass("fold");
                        } else {
                            $parentLi.addClass("fold");
                        }
                    }
                };


                function getTreeData() {
                    $scope.status.isLoading = true;
                    requestData($attrs.treeList)
                        .then(function(results) {
                            var data = results[0];
                            $scope.treeList = buildTree(data,$attrs.pidKey);
                            $scope.status.isLoading = false;
                            if (isFirstLoad && angular.isDefined($attrs.selectFirst)) {
                                isFirstLoad = false;
                                $timeout(function() {
                                    var $em = $element.find("em");
                                    for (var i = 0, l = $em.length; i < l; i++) {
                                        $em.eq(i).trigger("click");
                                        if ($em.eq(i).next("ul").length == 0) {
                                            break;
                                        }
                                    }
                                })
                            }
                        })
                        .catch(function() {
                            $scope.status.isLoading = false;
                        });
                }

                $attrs.$observe("treeList", getTreeData)
            }
        }
    };
    treeList.$inject = ["buildTree","requestData", "$timeout"];

    /**
     * 树状列表2
     */
    function treeList2(buildTree,requestData, modal, $timeout, dialogConfirm) {
        return {
            restrict: 'AE',
            require: "?^ngModel",
            link: function($scope, $element, $attrs, ngModel) {
                var canSelectGroup = angular.isDefined($attrs.selectGroup);
                $scope.status = {};
                $scope.treeList = [];
                $scope.curTree = {};
                $scope.status.isLoading = true;

                $scope.selectTree = function(tree, e) {
                    var $li = $element.find("li");
                    var $em = $(e.currentTarget);
                    var $parentLi = $em.parent("li");
                    var _tree = angular.copy(tree);
                    if (_tree.nodes.length == 0 || canSelectGroup) {
                        $li.removeClass("on");
                        $parentLi.addClass("on");
                        delete _tree.nodes;
                        ngModel && ngModel.$setViewValue(_tree);
                    } else {
                        if ($parentLi.hasClass("fold")) {
                            $parentLi.removeClass("fold");
                        } else {
                            $parentLi.addClass("fold");
                        }
                    }
                };

                $scope.extendTree = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $this = $(e.currentTarget);
                    var $parentLi = $this.parent().parent("li");
                    if ($parentLi.hasClass("fold")) {
                        $parentLi.removeClass("fold");
                        $this.parent().next().hide();
                    } else {
                        $parentLi.addClass("fold");
                        $this.parent().next().show();
                    }
                };

                $scope.deleteTree = function(e, _url) {
                    e.preventDefault();
                    e.stopPropagation();
                    dialogConfirm("是否删除?", function() {
                        requestData(_url).then(function() {
                            getTreeData();
                        });
                    });
                };

                $scope.addTree = function(e, _url) {
                    e.preventDefault();
                    e.stopPropagation();

                    modal.closeAll();

                    modal.open({
                        template: _url,
                        className: 'ngdialog-theme-right',
                        cache: false,
                        trapFocus: true,
                        overlay: false,
                        scope: $scope,
                        controller: ["$scope", "$element", function($scope, $element) {
                            $(".ngdialog-content", $element).width(400);
                        }]
                    });
                };

                function getTreeData() {
                    $scope.status.isLoading = true;
                    requestData($attrs.treeList2)
                        .then(function(results) {
                            var data = results[0];
                            $scope.treeList = buildTree(data,$attrs.pidKey);
                            $scope.status.isLoading = false;
                        })
                        .catch(function() {
                            $scope.status.isLoading = false;
                        });
                }

                $attrs.$observe("treeList2", getTreeData);

                //弹窗修改后的回调
                $scope.submitCallBack = function(_curRow, _data) {
                    modal.closeAll();
                    getTreeData();
                };
            }
        }
    };
    treeList2.$inject = ["buildTree","requestData", "modal", "$timeout", "dialogConfirm"];

    /**
     * 导航列表
     */
    function navList(requestData) {
        return {
            restrict: 'AE',
            scope: true,
            transclude: true,
            require: "?^ngModel",
            link: function($scope, $element, $attrs, ngModel, $transclude) {
                $transclude($scope, function(clone) {
                    $element.append(clone);
                });

                var statusInfo = {
                    isLoading: true
                };
                $scope.status = statusInfo;
                $scope.currentSelect = {};

                var formData = {};

                $scope.select = function(_project) {
                    $scope.currentSelect = _project;
                    ngModel && ngModel.$setViewValue(_project);
                };

                function getListData(_callback) {
                    if ($attrs.listSource) {
                        $scope.tbodyList = $scope.listSource;
                        _callback && _callback();
                        return;
                    }
                    statusInfo.isLoading = true;

                    requestData($attrs.navList)
                        .then(function(results) {
                            var data = results[0];
                            $scope.isLoading = false;
                            $scope.listData = data.data;
                            $scope.select($scope.listData[0]);
                        })
                        .catch(function() {
                            $scope.isLoading = false;
                        });
                };

                getListData();
            }
        }
    };
    navList.$inject = ["requestData"];

    /**
     * 异步下拉
     */
    function selectAsync(requestData) {
        return {
            restrict: 'A',
            scope: {},
            require: "?^ngModel",
            link: function($scope, $element, $attrs, ngModel) {

                requestData($attrs.selectAsync)
                    .then(function(results) {
                        var data = results[0];
                        var _options = '<option value="">请选择</option>';
                        if (!data) data = [];
                        var _length = data.length;
                        for (var i = 0; i < _length; i++) {
                            _options += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                        }
                        $element.html(_options);
                        ngModel && $element.val(ngModel.$viewValue);
                    });
            }
        };
    }
    selectAsync.$inject = ["requestData"];

    /**
     * 级联下拉
     */
    function relativeSelect(requestData, $timeout) {
        return {
            restrict: 'A',
            scope: {},
            require: "?^ngModel",
            link: function($scope, $element, $attrs, ngModel) {
                var _relativeTo = $attrs.relativeTo;
                var _relativeSelect = $attrs.relativeSelect;
                var isSelectFirst = angular.isDefined($attrs.selectFirst);
                var relativeInitload = angular.isDefined($attrs.relativeInitload);

                $element.on("change", changeHandle);

                $element.on("update", function(e, _data) {
                    getData(_data);
                });

                function changeHandle() {
                    var _data = {};
                    _data[$element[0].name] = $element.val();
                    $(_relativeTo).trigger("update", _data);
                }

                function getData(_data) {
                    requestData(_relativeSelect, _data)
                        .then(function(results) {
                            var data = results[0];
                            var _options = isSelectFirst ? '' : '<option value="">请选择</option>';
                            if (!data) data = [];
                            var _length = data.length;
                            var _value = "";
                            for (var i = 0; i < _length; i++) {
                                if (data[i].selected || (isSelectFirst && i == 0)) {
                                    _value = data[i].value;
                                }
                                _options += '<option ' + (data[i].enabled === 0 ? ' class="text-muted"' : '') + ' value="' + data[i].value + '">' + data[i].text + '</option>';
                            }
                            $element.html(_options);
                            //$element.trigger("change");
                            $element.val(_value);
                            ngModel && ngModel.$setViewValue(_value);
                            changeHandle();
                        });
                }

                if (relativeInitload) {
                    $timeout(changeHandle);
                }
            }
        }
    };
    relativeSelect.$inject = ["requestData", "$timeout"];

    /**
     * 图表
     */
    function eChart(requestData, dialogChart) {
        return {
            restrict: 'A',
            scope: {
                clickToUrl: "@",
                clickToDialog: "@",
                clickTopToUrl: "@",
                clickTopToDialog: "@",
                eChartKey: "@",
                eChartMap: "=",
                eChartMapData: "=",
                chartParams: "="
            },
            require: "?^ngModel",
            link: function($scope, $element, $attrs, ngModel) {
                $scope.isLoading = false;

                require(['echarts'], function(echarts) {
                    var myChart = echarts.init($element[0]);

                    //公布echar对象。用于获取图片等特色操作
                    if ($scope.eChartKey) {
                        if (!$scope.$parent.eChartMap) $scope.$parent.eChartMap = {};
                        $scope.$parent.eChartMap[$scope.eChartKey] = myChart;
                    }

                    function reSize() {
                        myChart.resize();
                    }
                    $(window).on("resize", reSize);
                    $scope.$on('$destroy', function() {
                        $(window).off("resize", reSize);
                        myChart.dispose();
                    });

                    myChart.on("click", function(_data) {

                        console.log(_data);
                        console.log($scope);

                        if (_data.data) {
                            if ($scope.clickToUrl) {
                                ngModel && ngModel.$setViewValue(_data.data);
                                window.location.assign($scope.clickToUrl);
                            } else if ($scope.clickToDialog) {
                                ngModel && ngModel.$setViewValue(_data.data);
                                dialogChart($scope.$parent.mainConfig.viewsDir + $scope.clickToDialog);
                            }

                        } else {

                            if ($scope.clickTopToUrl) {

                                ngModel && ngModel.$setViewValue(_data);
                                window.location.assign($scope.clickTopToUrl);
                            } else if ($scope.clickTopToDialog) {
                                ngModel && ngModel.$setViewValue(_data);
                                dialogChart($scope.$parent.mainConfig.viewsDir + $scope.clickTopToDialog);
                            }

                        }


                    });

                    if (angular.isDefined($attrs.chartParams)) {
                        //监听具体值
                        $scope.$watch("chartParams", function(value) {
                            loadChart($attrs.chart, value);
                        }, true);
                    } else {
                        $attrs.$observe("chart", function(value) {
                            loadChart($attrs.chart);
                        });
                    }
                    loadChart($attrs.chart, $scope.chartParams);

                  function loadChart(_url, _params){
                    if ($scope.isLoading) {
                        return;
                    }
                    $scope.isLoading = true;
                    myChart.showLoading();

                    $.ajax({
                      url: _url,
                      type: "GET",
                      xhrFields:{withCredentials: true},
                      crossDomain:true,
                      dataType: 'text',//text,json
                      success: function (text) {
                        // var results=eval(text);
                        //eavl 作用域设置为当前，支持执行echart提供方法。
                        var results=  eval( "(" + text + ")" );


                        if ( results.code != 200) {
                            console.log(_data);
                              alertError(_data.msg || '出错了');
                            return ;

                        }

                          var _data = results.data;

                        //js api 增加功能：eChart组件将data返回给$scope.$parent.eChartMapData[$scope.eChartKey] 用于显示数据。
                        if ($scope.eChartKey) {
                            if (!$scope.$parent.eChartMapData) $scope.$parent.eChartMapData = {};
                            $scope.$parent.eChartMapData[$scope.eChartKey] = _data;
                        }

                        myChart.hideLoading();
                        //解决百度图表雷达图 Tip 显示不正确的问题
                        if (_data.polar) {
                            _data.tooltip.formatter = function(_items) {
                                var _str = _items[0].name;
                                angular.forEach(_items, function(_item) {
                                    _str += '<br>' + _item.seriesName + ": " + _item.data;
                                });
                                return _str;
                            }
                        } else {
                            if (_data.tooltip.formatter && _data.tooltip.formatter.indexOf("function") == 0) {
                                _data.tooltip.formatter = eval("(" + _data.tooltip.formatter + ")");
                            }
                        }
                        myChart.setOption(_data);
                        $scope.isLoading = false;
                      },
                      error:function(res){
                        //{readyState: 0, responseText: "", status: 0, statusText: "error"}
                          alert("服务器连接不上或内部异常："+res.responseText);
                      }
                    });

                  }//end loadChart
                    //
                    // function loadChart2(_url, _params) {
                    //     if ($scope.isLoading) {
                    //         return;
                    //     }
                    //     $scope.isLoading = true;
                    //     myChart.showLoading();
                    //     requestData(_url, _params)
                    //         .then(function(results) {
                    //             var _data = results[0];
                    //
                    //             //js api 增加功能：eChart组件将data返回给$scope.$parent.eChartMapData[$scope.eChartKey] 用于显示数据。
                    //             if ($scope.eChartKey) {
                    //                 if (!$scope.$parent.eChartMapData) $scope.$parent.eChartMapData = {};
                    //                 $scope.$parent.eChartMapData[$scope.eChartKey] = _data;
                    //             }
                    //
                    //             myChart.hideLoading();
                    //             //解决百度图表雷达图 Tip 显示不正确的问题
                    //             if (_data.polar) {
                    //                 _data.tooltip.formatter = function(_items) {
                    //                     var _str = _items[0].name;
                    //                     angular.forEach(_items, function(_item) {
                    //                         _str += '<br>' + _item.seriesName + ": " + _item.data;
                    //                     });
                    //                     return _str;
                    //                 }
                    //             } else {
                    //                 if (_data.tooltip.formatter && _data.tooltip.formatter.indexOf("function") == 0) {
                    //                     _data.tooltip.formatter = eval("(" + _data.tooltip.formatter + ")");
                    //                 }
                    //             }
                    //             myChart.setOption(_data);
                    //             $scope.isLoading = false;
                    //         })
                    //         .catch(function(_msg) {
                    //             $scope.isLoading = false;
                    //             myChart.hideLoading();
                    //         });
                    // };
                });
            }
        };
    };
    eChart.$inject = ["requestData", "dialogChart"];

    /**
     * 自动补全
     */
    function angucomplete($parse, requestData, $sce, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                "placeholder": "@",
                "selectedItem": "=?",
                "url": "@",
                "titleField": "@",
                "descriptionField": "@",
                //"localData": "=?",
                "searchFields": "@",
                "matchClass": "@",
                "ngDisabled": "=?"
            },
            require: "?^ngModel",
            templateUrl: Config.tplPath + 'tpl/autocomplete.html',
            link: function($scope, elem, attrs, ngModel) {
                $scope.lastSearchTerm = null;
                $scope.currentIndex = null;
                $scope.justChanged = false;
                $scope.searchTimer = null;
                $scope.hideTimer = null;
                $scope.searching = false;
                $scope.pause = 300;
                $scope.minLength = 1;
                $scope.searchStr = null;

                var isNewSearchNeeded = function(newTerm, oldTerm) {
                    return newTerm.length >= $scope.minLength && newTerm != oldTerm
                };

                $scope.processResults = function(responseData, str) {
                    if (responseData && responseData.length > 0) {
                        $scope.results = [];

                        var titleFields = [];
                        if ($scope.titleField && $scope.titleField != "") {
                            titleFields = $scope.titleField.split(",");
                        }

                        for (var i = 0; i < responseData.length; i++) {
                            // Get title variables
                            var titleCode = [];

                            for (var t = 0; t < titleFields.length; t++) {
                                titleCode.push(responseData[i][titleFields[t]]);
                            }

                            var description = "";
                            if ($scope.descriptionField) {
                                description = responseData[i][$scope.descriptionField];
                            }

                            var text = titleCode.join(' ');
                            if ($scope.matchClass) {
                                var re = new RegExp(str, 'i');
                                var strPart = text.match(re)[0];
                                text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
                            }

                            var resultRow = {
                                id: responseData[i].id,
                                title: text,
                                description: description,
                                //image: image,
                                originalObject: responseData[i]
                            };

                            $scope.results[$scope.results.length] = resultRow;
                        }


                    } else {
                        $scope.results = [];
                    }
                };

                $scope.searchTimerComplete = function(str) {
                    // Begin the search

                    if (str.length >= $scope.minLength) {
                        if ($scope.localData) {
                            var searchFields = $scope.searchFields.split(",");

                            var matches = [];

                            for (var i = 0; i < $scope.localData.length; i++) {
                                var match = false;

                                for (var s = 0; s < searchFields.length; s++) {
                                    match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                                }

                                if (match) {
                                    matches[matches.length] = $scope.localData[i];
                                }
                            }

                            $scope.searching = false;
                            $scope.processResults(matches, str);

                        } else {
                            requestData($scope.url, {
                                    q: str
                                })
                                .then(function(results) {
                                    var data = results[0];
                                    $scope.searching = false;
                                    $scope.processResults(data, str);
                                })
                                .catch(function(error) {
                                    $scope.searching = false;
                                    console.error(error);
                                });
                        }
                    }
                };

                $scope.hideResults = function() {
                    $scope.hideTimer = $timeout(function() {
                        $scope.showDropdown = false;
                    }, $scope.pause);
                };

                $scope.resetHideResults = function() {
                    if ($scope.hideTimer) {
                        $timeout.cancel($scope.hideTimer);
                    }
                };

                $scope.hoverRow = function(index) {
                    $scope.currentIndex = index;
                };

                $scope.keyPressed = function(event) {
                    if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                        if (!$scope.searchStr || $scope.searchStr == "") {
                            $scope.showDropdown = false;
                            $scope.lastSearchTerm = null
                        } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                            $scope.lastSearchTerm = $scope.searchStr;
                            $scope.showDropdown = true;
                            $scope.currentIndex = -1;
                            $scope.results = [];

                            if ($scope.searchTimer) {
                                $timeout.cancel($scope.searchTimer);
                            }

                            $scope.searching = true;

                            $scope.searchTimer = $timeout(function() {
                                $scope.searchTimerComplete($scope.searchStr);
                            }, $scope.pause);
                        }
                    } else {
                        event.preventDefault();
                    }
                };

                $scope.selectResult = function(result) {
                    if ($scope.matchClass) {
                        result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                    }
                    $scope.searchStr = $scope.lastSearchTerm = result.title;
                    $scope.selectedItem = result;
                    $scope.showDropdown = false;
                    $scope.results = [];
                    ngModel && ngModel.$setViewValue(result.id);
                };

                var inputField = elem.find('input');

                inputField.on('keyup', $scope.keyPressed);

                elem.on("keyup", function(event) {
                    if (event.which === 40) {
                        if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                            $scope.currentIndex++;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                        $scope.$apply();
                    } else if (event.which == 38) {
                        if ($scope.currentIndex >= 1) {
                            $scope.currentIndex--;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    } else if (event.which == 13) {
                        if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                            $scope.selectResult($scope.results[$scope.currentIndex]);
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        } else {
                            $scope.results = [];
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    } else if (event.which == 27) {
                        $scope.results = [];
                        $scope.showDropdown = false;
                        $scope.$apply();
                    } else if (event.which == 8) {
                        $scope.selectedItem = null;
                        $scope.$apply();
                    }
                });

            }
        };
    };
    angucomplete.$inject = ["$parse", "requestData", "$sce", "$timeout"];

    /**
     * checkbox
     */
    function checkboxGroup() {
        return {
            restrict: "A",
            scope: {
                checkboxGroup: "="
            },
            link: function($scope, $elem, $attrs) {
                if (!angular.isArray($scope.checkboxGroup)) {
                  $scope.checkboxGroup = [];
                }

                //if ($scope.checkboxGroup.indexOf($attrs.value) !== -1) {
                //    $elem[0].checked = true;
                //}

                // Update array on click
                $elem.on('click', function() {
                    var index =-1;
                    if (!angular.isArray($scope.checkboxGroup)) {
                      $scope.checkboxGroup = [];
                    }
                    if(angular.isArray($scope.checkboxGroup))
                        index=$scope.checkboxGroup.indexOf($attrs.value);
                    // Add if checked
                    if ($elem[0].checked) {
                        if (index === -1) $scope.checkboxGroup.push($attrs.value);
                    }
                    // Remove if unchecked
                    else {
                        if (index !== -1) $scope.checkboxGroup.splice(index, 1);
                    }
                    $scope.$apply();
                });

                $scope.$watchCollection("checkboxGroup", function(value) {
                    if (value) {
                        if ($scope.checkboxGroup.indexOf($attrs.value) !== -1) {
                            $elem[0].checked = true;
                        }
                    }
                })
            }
        }
    }

    /**
      * 下拉

      $attrs.clearWatchScope:监听一个model 当一个model清空时,重置cosen
      $attrs.selectCallBack
      $attrs.pageSize:


      queryForSelectOption.json?q=&id=&pageSize=
      3个参数：q：关键词。
      id：指定id，id！=null&&q==null 时，根据id查询，q不为空时根据q查询。
      pageSize：指定返回数据条数
      */
    function chosen(requestData, $timeout, $rootScope, alertError, proLoading) {
        return {
            restrict: 'A',
            //  scope: {
            //      chosen: '='
            //  },
            require: "?^ngModel",
            link: function($scope, $element, $attrs, ngModel) {
              var chosenConfig = {
                  search_contains: true,
                  no_results_text: "没有找到",
                  display_selected_options: false
              };

              if ($attrs.selectCallBack) {
                $element.on("change", changeHandle);
                $element.on("update", function(e, _data) {
                    getData(_data);
                });
              }

              function changeHandle() {
                var _data = {};
                _data.value = $element.val();
                $scope[$attrs.selectCallBack](_data);
              }

              var chosenObj = null;
              // 监听一个model 当一个model清空时,重置cosen
              if ($attrs.clearWatchScope) {
                $scope.$watch($attrs.clearWatchScope, function(newValue, oldValue) {
                  if(chosenObj && !newValue){
                    $timeout(function() {
                      chosenObj.data("chosen").form_field_jq.trigger("change");
                    }, 800);
                  }
                });
              }

              if ($attrs.width) {
                chosenConfig.width = $attrs.width;
              }

              require(['chosen'], function() {
                if ($attrs.selectSource) {
                  if (angular.isDefined($attrs.chosenAjax)) {
                    chosenObj = $element.chosen(chosenConfig);
                    var $chosenContainer = $element.next();
                    var $input = $('input', $chosenContainer);
                    var searchStr = "";
                    var isChinessInput = false;
                    var typing = false;
                    var requestQueue;
                    var _url = $attrs.selectSource;

                    if (Config.serverPath) {
                      if (_url.indexOf("http://") !== 0 && _url.indexOf("https://") !== 0) {
                        _url = Config.serverPath + _url;
                      }
                    }

                    //
                    // if($attrs.watchName){
                    //   $scope.$watch($attrs.watchName, function(n, o){
                    //             console.log(n);
                    //               console.log(o);
                    //         if(n==o)return;
                    //         $input.val(n);
                    //     },true);

                      // var tmp=  $scope.$eval($attrs.ngModelName);
                      // console.log(tmp);
                      // $input.val(tmp);
                    // }
                    //解决第二次编辑打开时，没有显示初始值bug。
                    if(ngModel.$viewValue){
                      handleSearch('');
                    }

                    function handleSearch(q) {
                        var selected = $('option:selected', $element).not(':empty').clone().attr('selected', true);
                        if (requestQueue) {
                          requestQueue.abort();
                        }

                        requestQueue = $.ajax({
                            url: _url,
                            type: 'GET',
                            xhrFields:{withCredentials: true},
                            crossDomain:true,
                            data: {
                                q: q,
                                id: ngModel.$viewValue
                            },
                            dataType: 'json',
                            success: function(_data) {
                              if (_data.code == 200) {
                                $rootScope.isLoading = false;
                                var _options = '';
                                if (!_data.data) _data.data = [];
                                if(_data.data.length === 0){
                                  _data.data.push({value:"",text:""});
                                }

                                var _length = _data.data.length;
                                var _selected = angular.isArray(ngModel.$viewValue) ? ngModel.$viewValue : [ngModel.$viewValue];
                                var data= _data.data;
                                for (var i = 0; i < _length; i++) {
                                    // var data= _data.data;
                                    // if (_selected.indexOf(_data.data[i].value) == -1) {
                                    //     _options += '<option value="' + _data.data[i].value + '">' + _data.data[i].text + '</option>';
                                    // }

                                    _options += '<option value="' + data[i].value + '"' + (_selected.indexOf(data[i].value) > -1 ? 'selected' : '') + '>' + data[i].text + '</option>';

                                }
                                $element.html(_options).prepend(selected);
                                $element.trigger("chosen:updated");
                                var keyRight = $.Event('keydown');
                                keyRight.which = 39;
                                $input.val(q).trigger(keyRight);

                                if (_data.data.length > 0) {
                                    $chosenContainer.find('.no-results').hide();
                                } else {
                                    $chosenContainer.find('.no-results').show();
                                }
                              } else {
                                if(angular.isDefined($attrs.alertError)){
                                    alet(_data.msg);
                                }
                              }
                            },
                            complete: function() {
                                $scope.$digest();
                            }
                        });
                    }

                    function processValue(e) {
                      var field = $(this);
                      if (e.keyCode && e.keyCode === 13) {
                        //修复第一次输入后，直接回车没有取到值的bug
                        if (!ngModel.$viewValue) {
                          try {
                            ngModel.$setViewValue(chosenObj[0][0].value);
                          } catch (e) {}
                        }
                      }
                        //don't fire ajax if...
                      if ((e.type === 'paste' && field.is(':not(:focus)')) ||
                          (e.keyCode && (
                              (e.keyCode === 9) || //Tab
                              (e.keyCode === 13) || //Enter
                              (e.keyCode === 16) || //Shift
                              (e.keyCode === 17) || //Ctrl
                              (e.keyCode === 18) || //Alt
                              (e.keyCode === 19) || //Pause, Break
                              (e.keyCode === 20) || //CapsLock
                              (e.keyCode === 27) || //Esc
                              (e.keyCode === 33) || //Page Up
                              (e.keyCode === 34) || //Page Down
                              (e.keyCode === 35) || //End
                              (e.keyCode === 36) || //Home
                              (e.keyCode === 37) || //Left arrow
                              (e.keyCode === 38) || //Up arrow
                              (e.keyCode === 39) || //Right arrow
                              (e.keyCode === 40) || //Down arrow
                              (e.keyCode === 44) || //PrntScrn
                              (e.keyCode === 45) || //Insert
                              (e.keyCode === 144) || //NumLock
                              (e.keyCode === 145) || //ScrollLock
                              (e.keyCode === 91) || //WIN Key (Start)
                              (e.keyCode === 93) || //WIN Menu
                              (e.keyCode === 224) || //command key
                              (e.keyCode >= 112 && e.keyCode <= 123) //F1 to F12
                          ))) {
                          return false;
                      }

                      if (isChinessInput && (e.keyCode != 32 && (e.keyCode < 48 || e.keyCode > 57))) {
                          return false;
                      }

                      $chosenContainer.find('.no-results').hide();

                      var q = $.trim(field.val());

                      if (!q && searchStr == q) {
                        return false;
                      } else {
                        proLoading($element, $scope, false, {});
                      }

                      typing = true;

                      if ($scope.searchTimer) {
                          $timeout.cancel($scope.searchTimer);
                      }

                      $scope.searchTimer = $timeout(function() {
                          typing = false;
                          handleSearch(q);
                      }, 500);
                    }

                    $('.chosen-search > input, .chosen-choices .search-field input', $chosenContainer)
                      .on('keyup', processValue)
                      .on('paste', function(e) {
                        var that = this;
                        setTimeout(function() {
                          processValue.call(that, e);
                        }, 500);
                      })
                      .on('keydown', function(e) {
                        if (e.keyCode == 229) {
                            isChinessInput = true;
                        } else {
                            isChinessInput = false;
                        }
                      })
                      .on('blur', function(e) {
                        //修复第一次输入后，直接回车没有取到值的bug
                        if (!ngModel.$viewValue) {
                          try {
                             chosenObj&&chosenObj.data("chosen").single_set_selected_text();
                            // if (chosenObj[0] && chosenObj[0][0]) ngModel.$setViewValue(chosenObj[0][0].value);
                          } catch (e) {}
                        }
                      });
                    } else {
                      function getData(){
                        //满足条件才异步请求
                        if (angular.isDefined($attrs.ajaxIf)) {
                            if (!$attrs.ajaxIf) return;
                        }

                        requestData($attrs.selectSource)
                          .then(function(results) {
                              var data = results[0];
                              var _options = '';
                              if (!data) data = [];
                              var _length = data.length;
                              //  var _selected = angular.isArray(ngModel.$viewValue) ? ngModel.$viewValue : [data[0].value];

                              var _selected=null;
                              if(angular.isDefined($attrs.multiple)){
                                  if (angular.isDefined($attrs.defaultEmpty)) {
                                     _selected= ngModel.$viewValue ? ngModel.$viewValue : [];
                                  } else {
                                      _selected= ngModel.$viewValue ? ngModel.$viewValue : [data[0].value];
                                  }
                              } else {
                                 if (angular.isDefined($attrs.defaultEmpty)) {
                                  _selected= ngModel.$viewValue ? ngModel.$viewValue :"";
                                 } else {
                                   _selected= ngModel.$viewValue ? ngModel.$viewValue : data[0].value;

                                 }
                              }
                              if (angular.isDefined($attrs.defaultEmpty)) {
                                  _options += '<option value=""  >' + $attrs.defaultEmpty + '</option>';
                              }
                              for (var i = 0; i < _length; i++) {
                                  _options += '<option value="' + data[i].value + '"' + (_selected.indexOf(data[i].value) > -1 ? 'selected' : '') + '>' + data[i].text + '</option>';
                              }
                              $element.html(_options);
                              chosenObj=$element.chosen($scope.chosen || chosenConfig);
                              ngModel.$setViewValue(_selected);
                          }).catch(function(msg) {
                              if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                              if (angular.isDefined($attrs.alertError)) alertError(msg);
                          });
                  }

                  //监听
                  $attrs.$observe("selectSource", function(value) {
                      ngModel.$setViewValue(null);
                        chosenObj&&chosenObj.data("chosen").destroy();
                      // chosenObj&&chosenObj.data("chosen").single_set_selected_text();
                      getData();
                  });

                  getData();

                  }
                } else {
                //修复select 初始值为null，没有对应的option值时，angluarjs自动添加，空option 导致 chonsen控件，选择其他值后，不能选择最后一条bug。
                $element.append("<option value=''></option>");
                $element.chosen($scope.chosen || chosenConfig);
                }
              })
            }
        }
    };
    chosen.$inject = ["requestData", "$timeout", "$rootScope", "alertError", "proLoading"];

    /**
     * form-item
     */
    function formItem($compile) {
        return {
            restrict: 'AE',
            scope: true,
            replace: true,
            link: function($scope, $element, $attrs) {
                var _src = $scope.$eval($attrs.src);
                var _item = "";
                switch (_src.type) {
                    case "text":
                        _item = '<input type="' + _src.type + '" name="' + _src.key + '" ng-init="formData[\'' + _src.key + '\']=\'' + (_src.value || "") + '\'" ng-model="formData[\'' + _src.key + '\']" class="ipt" placeholder="' + _src.placeholder + '" />';
                        break;
                    case "hidden":
                        _item = '<input type="' + _src.type + '" name="' + _src.key + '" ng-init="formData[\'' + _src.key + '\']=\'' + (_src.value || "") + '\'" ng-model="formData[\'' + _src.key + '\']"/>';
                        break;
                    case "date":
                        _item = '<input type="' + _src.type + '" name="' + _src.key + '" ng-init="formData[\'' + _src.key + '\']=\'' + (_src.value || "") + '\'" ng-model="formData[\'' + _src.key + '\']" class="ipt" placeholder="' + _src.placeholder + '" convert-to-date/>';
                        break;
                    case "checkbox":
                        _item = '<div class="form-ctrl" ng-init="formData[\'' + _src.key + '\']=[\'' + (_src.value || "") + '\']">';
                        angular.forEach(_src.options, function(item) {
                            _item += '<label class="label">' +
                                '<input type="' + _src.type + '" name="' + _src.key + '" checkbox-group="formData[\'' + _src.key + '\']"  value="' + item + '" /> ' + item +
                                '</label>';
                        });
                        _item += '</div>';
                        break;
                    case "radio":
                        _item = '<div class="form-ctrl" ng-init="formData[\'' + _src.key + '\']=\'' + (_src.value || "") + '\'">';
                        angular.forEach(_src.options, function(item) {
                            _item += '<label class="label">' +
                                '<input type="' + _src.type + '" name="' + _src.key + '" ng-model="formData[\'' + _src.key + '\']"  value="' + item + '" /> ' + item +
                                '</label>';
                        });
                        _item += '</div>';
                        break;
                    case "select":
                        _item = '<select class="select select-w" name="' + _src.key + '" ng-init="formData[\'' + _src.key + '\']=\'' + (_src.value || "") + '\'" ng-model="formData[\'' + _src.key + '\']"  >';
                        _item += '<option value="" >请选择</option>';
                        angular.forEach(_src.options, function(item) {
                            _item += '<option value="' + item + '" >' + item + '</option>';
                        });
                        _item += '</select>';
                        break;
                    case "textarea":
                        _item = '<textarea name="' + _src.key + '" ng-init="formData[\'' + _src.key + '\']=\'' + (_src.value || "") + '\'" ng-model="formData[\'' + _src.key + '\']"  class="textarea" placeholder="' + _src.placeholder + '"></textarea>';
                        break;
                }
                $element.append($compile(_item)($scope));
            }
        }
    };
    formItem.$inject = ["$compile"];

    /**
     * 自定义配置 (资源相关)
     */
    function customConfig($timeout) {
        return {
            restrict: 'AE',
            scope: true,
            transclude: true,
            require: "?^ngModel",
            link: function($scope, $element, $attrs, ngModel, $transclude) {
                $timeout(function() {
                    ngModel && ($scope.dataList = ngModel.$viewValue || []);
                });

                $scope.$watchCollection("dataList", function(value) {
                    if (value && ngModel) {
                        ngModel.$setViewValue(value);
                    }
                });

                $scope.addRow = function() {
                    $scope.dataList.push({});
                };

                $scope.delRow = function(n) {
                    $scope.dataList.splice(n, 1);
                };

                $transclude($scope, function(clone) {
                    $element.append(clone);
                });
            }
        };
    };
    customConfig.$inject = ["$timeout"];



        /**
         * 自动
         */
        function autoComplete() {
            return {
                restrict: 'AE',
                scope: true,
                transclude: true,
                require: "?^ngModel",
                link: function($scope, $element, $attrs, ngModel, $transclude) {
                    var config = {
                        parse: function(data){
                          var parsed = [];
                          if(!data||!data.data)return parsed;
                          		var rows = data.data;
                          		for (var i=0; i < rows.length; i++) {
                          			var row1 = $.trim(rows[i]);
                          			if (row1) {
                          				row = row1.split("|");
                          				parsed[parsed.length] = {
                          					data: row1,
                          					value: row[0],
                          					result:row[0]
                          				};
                          			}
                          		}
                          		return parsed;


                        },
                        formatItem:function(item){return item},

                        noRecord:"没匹配数据",
                        dataType:"json"

                    };



                    require(['autocomplete'], function() {

                        if ($attrs.autoComplete) {
                          var _url=$attrs.autoComplete;
                          if(Config.serverPath){
                            if (_url.indexOf("http://") !==0 && _url.indexOf("https://") !== 0) {
                              _url=Config.serverPath+_url;
                            }
                          }

                          var tmpautocomplete=null;
                          $element.focus(function(){
                            if(tmpautocomplete!=null){
                              return;
                            }

                            config.width=$element.css("width");//弹出窗口时才生效
                            tmpautocomplete = $element.autocomplete(_url,config);

                            tmpautocomplete.result(function(obj,text,val){
                              console.log(text);
                            });

                          });

                        }

                });
            }
        };
      }



    //省市县的三级联动
    function selectAddress ($http, $q, $compile) {
        var cityURL, delay, templateURL;
        delay = $q.defer();
        templateURL = Config.tplPath+'tpl/cascading-select-address/cascading-select-address.html';
        cityURL = Config.tplPath+'tpl/cascading-select-address/city.min.js';
        $http.get(cityURL).success(function(data) {
            return delay.resolve(data);
        });
        return {
            restrict: 'A',
            scope: {
                p: '=',
                a: '=',
                c: '=',
                d: '=',
                ngModel: '='
            },
            link: function(scope, element, attrs) {
                var popup;
                popup = {
                    element: null,
                    backdrop: null,
                    show: function() {
                        return this.element.addClass('active');
                    },
                    hide: function() {
                        this.element.removeClass('active');
                        return false;
                    },
                    resize: function() {
                        if (!this.element) {
                            return;
                        }
                        this.element.css({
                            top: -this.element.height() - 30,
                            'margin-left': -this.element.width() / 2
                        });
                        return false;
                    },
                    focus: function() {
                        $('[ng-model="d"]').focus();
                        return false;
                    },
                    init: function() {
                        element.on('click keydown', function() {
                            popup.show();
                            event.stopPropagation();
                            return false;
                        });
//                        $(window).on('click', (function(_this) {
//                            return function() {
//                                return _this.hide();
//                            };
//                        })(this));
                        this.element.on('click', function() {
                            return event.stopPropagation();
                        });
                        return setTimeout((function(_this) {
                            return function() {
                                _this.element.show();
                                return _this.resize();
                            };
                        })(this), 500);
                    }
                };
                return delay.promise.then(function(data) {
                    $http.get(templateURL).success(function(template) {
                        var $template;
                        $template = $compile(template)(scope);
                        $('body').append($template);
                        popup.element = $($template[2]);
                        scope.provinces = data;
                        return popup.init();
                    });
                    scope.aSet = {
                        p: function(p) {
                            scope.p = p;
                            scope.c = null;
                            scope.a = null;
                            return scope.d = null;
                        },
                        c: function(c) {
                            scope.c = c;
                            scope.a = null;
                            return scope.d = null;
                        },
                        a: function(a) {
                            scope.a = a;
                            scope.d = null;
                            return popup.focus();
                        }
                    };
                    scope.clear = function() {
                        scope.p = null;
                        scope.c = null;
                        scope.a = null;
                        return scope.d = null;
                    };
                    scope.submitAddress = function() {
                        return popup.hide();
                    };
                    scope.$watch('p', function(newV) {
                        var v, _i, _len, _results;
                        if (newV) {
                            _results = [];
                            for (_i = 0, _len = data.length; _i < _len; _i++) {
                                v = data[_i];
                                if (v.p === newV) {
                                    _results.push(scope.cities = v.c);
                                }
                            }


                        }
                        if(!scope.cities ){
                            scope.cities=[];
                            return scope.cities;
                        }

                        return _results;
                    });
                    scope.$watch('c', function(newV) {
                        var v, _i, _len, _ref, _results;
                        if (newV) {
                            _ref = scope.cities;
                            _results = [];

                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                v = _ref[_i];
                                if (v.n === newV) {
                                    _results.push(scope.dists = v.a);
                                }
                            }
                            return _results;
                        } else {
                            return scope.dists = [];
                        }
                    });
                    return scope.$watch(function() {
                        scope.ngModel = '';
                        if (scope.p) {
                            scope.ngModel += scope.p;
                        }
                        if (scope.c) {
                            scope.ngModel += " " + scope.c;
                        }
                        if (scope.a) {
                            scope.ngModel += " " + scope.a;
                        }
                        if (scope.d) {
                            scope.ngModel += " " + scope.d;
                        }
                        return popup.resize();
                    });
                });
            }
        };
    };
    selectAddress.$inject = ["$http", "$q", "$compile"];
    /**
     * 加入项目
     */
    angular.module('manageApp.main')
        .directive("ngView", ["$route", "$templateCache", "$routeParams", ngView])
        .directive("convertToDate", convertToDate)
        .directive("convertToNumber", convertToNumber)
        .directive("convertJsonToObject", convertJsonToObject)
        .directive("ajaxUrl", ["$timeout", "requestData", "alertOk", "alertError", "proLoading", ajaxUrl])
        .directive("formValidator", ["requestData", "modal", "alertOk", "alertError","dialogConfirm", formValidator])
        .directive("tableList", tableList)
        .directive("tableCell", tableCell)
        .directive("pagination", pagination)
        .directive("pagination2", pagination2)
        .directive("filterConditions", filterConditions)
        .directive("treeList", treeList)
        .directive("treeList2", treeList2)
        .directive("navList", navList)
        .directive("selectAsync", selectAsync)
        .directive("relativeSelect", relativeSelect)
        .directive("chart", eChart)
        .directive("angucomplete", angucomplete)
        .directive("checkboxGroup", checkboxGroup)
        .directive("chosen", chosen)
        .directive("formItem", formItem)
        .directive("autoComplete", autoComplete)
        .directive("selectAddress", ["$http", "$q", "$compile",selectAddress])
        .directive("customConfig", customConfig)
});
