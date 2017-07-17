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
                        return new Date(parseInt(ngModel.$modelValue,10)).getTime();
                    } else {
                        return new Date(parseInt(ngModel.$modelValue,10));
                    }
                });
            }
        };
    }

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
     function ajaxUrl($timeout, requestData, alertOk, alertError, proLoading,utils) {
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
                    if (angular.isDefined($attrs.ajaxIfEval)) {
                        var tmp=$scope.$eval($attrs.ajaxIfEval);
                      if (!tmp) return;
                    }
                    $scope.isLoading = true;
                    var maskObj=null;
                    if (!$attrs.noshowLoading) {
                      maskObj=proLoading($element);
                      //  if(maskObj)maskObj.hide();
                    }
                   if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] ="";
                    requestData($attrs.ajaxUrl, params)
                      .then(function(results) {
                            if(maskObj)maskObj.hide();
                          var data = results[0];

                          if ($scope.ajaxUrlHandler) {
                              data = $scope.ajaxUrlHandler(data);
                          }

                          if ($attrs.scopeResponse) $scope[$attrs.scopeResponse] = results[1];
                          // if ($attrs.scopeData) $scope[$attrs.scopeData] = data;
                          // else $scope.scopeData = data;


                          if ($attrs.scopeData){

                            if(!$scope[$attrs.scopeData]) {
                              if(angular.isArray(results[0])){
                                $scope[$attrs.scopeData]=[];//数组extend 会把数组转化成对象。
                              }else{
                                $scope[$attrs.scopeData]={};
                              }

                            }
                            utils.replaceObject($scope[$attrs.scopeData],results[0]);

                              // if(!$scope[$attrs.scopeData])  $scope[$attrs.scopeData]={};
                              // if(angular.isArray(results[0])){
                              //   $scope[$attrs.scopeData]=results[0];//数组extend 会把数组转化成对象。
                              // }else{
                              //   $.extend( true,$scope[$attrs.scopeData],  results[0]);//解决监听fromdata失败bug。
                              // }

                              // angular.extend(  $scope[$attrs.scopeData],  results[0]);//
                          }

                          if (angular.isDefined($attrs.alertOk)) alertOk(results[1].msg);

                          //回调父级的处理事件;
                          if ($scope.listCallback) {
                            $scope.listCallback(results[1]);
                          }

                          // $scope.$apply();
                          if ($attrs.callback) {
                              $scope.$eval($attrs.callback);
                          }


                          $scope.isLoading = false;
                      })
                      .catch(function(msg) {
                            if(maskObj)maskObj.hide();

                            if ($attrs.errorCallback) {
                                $scope.$eval($attrs.errorCallback);
                            }

                         if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                         if (angular.isDefined($attrs.alertError)) alertError(msg);
                         $('.pr-full-loading').remove();
                      });

                 }

                 $scope.$on("ajaxUrlReload", function() {
                    //  getData(_detailsParams);
                    getData({});

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

     // $scope添加方法：提交表单方法
       $scope.submitForm1();

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
    function formValidator(requestData, modal, alertOk, alertError, dialogConfirm, $timeout,utils) {
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


                // $scope.formData = angular.extend({}, $scope.formData);
                if(!$scope.formData)$scope.formData = angular.extend({}, $scope.formData);

                $scope.$watch($attrs.source, function(value) {
                    if (value && angular.isObject(value)) {
                        // angular.extend($scope.formData, value);
                          $.extend( true,$scope.formData, value);//解决监听fromdata失败bug。
                    }
                });

                // var appointScope=$scope;
                // //指定作用域
                // if($attrs.callbackScopeKey){
                //     var appointScope=  utils.getAppointScope($scope,$attrs.callbackScopeKey);
                //
                // }

                function ajax_submit(){
                  if(formStatus.submitting === true) return;
                  formStatus.submitting = true;

                  var parameterBody = false;
                  if (angular.isDefined($attrs.parameterBody)) {
                    parameterBody = true;
                    if($attrs.parameterBody=="false"){
                      parameterBody=false;
                    }
                  }
                  var data= $scope.formData;
                  if($attrs.formData){
                    data=$scope[$attrs.formData];
                  }
                  if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] ="";
                    if ($attrs.scopeOkMsg) $scope[$attrs.scopeOkMsg] ="";
                  var httpMethod="POST"
                  if($attrs.httpMethod){
                    httpMethod=$attrs.httpMethod;
                  }
                  requestData($attrs.action,data,httpMethod, parameterBody)
                    .then(function(results) {
                      var data = results[0];
                      var data1 = results[1];
                      formStatus.submitting = false;
                      formStatus.submitInfo = "";

                      if ($attrs.scopeResponse) $scope[$attrs.scopeResponse] = results[1];
                      if ($attrs.scopeData){
                        if(!$scope[$attrs.scopeData]) {
                          if(angular.isArray(results[0])){
                            $scope[$attrs.scopeData]=[];//数组extend 会把数组转化成对象。
                          }else{
                            $scope[$attrs.scopeData]={};
                          }

                        }
                        utils.replaceObject($scope[$attrs.scopeData],results[0]);
                          // $.extend( true,$scope[$attrs.scopeData],  results[0]);//解决监听fromdata失败bug。
                          // angular.extend(  $scope[$attrs.scopeData],  results[0]);//
                      }

                      if (angular.isDefined($attrs.alertOk)) alertOk(results[1].msg);
                      if ($attrs.scopeOkMsg) $scope[$attrs.scopeOkMsg] =results[1].msg;
                      //重置表单
                      if ($attrs.formSubmitAfter == "reset") {
                          DOMForm.reset();
                      }

                      if ($attrs.callback) {
                        // proMessageTips('测试文字tips');
                        // $timeout(function () {
                        //
                        // }, 3000);
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
                      if (angular.isDefined($attrs.autoCloseDialog)) {
                        modal.close();
                      }
                      //angular.isDefined($attrs.autoCloseDialog) && modal.close();

                  })
                  .catch(function(error) {
                      formStatus.submitting = false;
                      formStatus.submitInfo = error || '提交失败。';
                      if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] =error;
                      if (angular.isDefined($attrs.alertError)) alertError(error);
                      //angular.isFunction($scope.submitCallBack) && $scope.submitCallBack.call($scope, dialogData, "");
                  });
                }

                $element.on("submit", function(e) {
                  e.preventDefault();
                  if ($attrs.beforeConfirmMsg) {
                    dialogConfirm($attrs.beforeConfirmMsg, function () {
                      ajax_submit();
                    }, null);
                  } else {
                    ajax_submit();
                  }
                });

                //提交表单方法
                  $scope.submitForm1=function(){
                      $element.trigger('submit');
                  }

                  // 保存  type:save-草稿,submit-提交订单。
                  function goToFN(key,obj) {
                    if(!key||!obj)return;
                    var goToUrl=obj[key];
                    if(!goToUrl)return;
                    utils.goTo(goToUrl);
                  };

                   function updateStatusFN(key,obj,updateStatus) {

                      var url=updateStatus.url;
                      var data= updateStatus.param;
                      requestData(url,data, 'POST')
                        .then(function (results) {
                          var _data = results[1];
                         //  alertOk(_data.message || '操作成功');
                          goToFN(key,obj);
                        })
                        .catch(function (error) {
                          alertError(error || '出错');
                        });

                  };
                  // 保存  type:save-草稿,submit-提交订单。
                  $scope.submitFormAfter1 = function(key,obj,updateStatus) {
                    $scope.formData.validFlag = false;
                      if(!key)return;
                    if(updateStatus&&key==updateStatus.type){
                      updateStatusFN(key,obj,updateStatus);
                        return;
                    }
                    goToFN(key,obj);

                  };

              $scope.reset = function() {
                  DOMForm.reset();
              };



              if ($attrs.scopeExtend){
                  var scopeExtend=utils.getScopeExtend($scope,$attrs.scopeExtend);
                  if(scopeExtend){
                    scopeExtend.formValidator={};
                    scopeExtend.formValidator.reset=$scope.reset;
                      scopeExtend.formValidator.submitForm1=$scope.submitForm1;

                  }

              }


            }
        };
    }//formValidator




    /**
     * 表格
     */
    function tableList(requestData, modal, dialogConfirm, $timeout, proLoading,alertError) {
        return {
            restrict: 'AE',
            scope: {
                listParams: "=?",
                listSelected: "=?",
                listSource: "=?",
                listObject: "=?"
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
                if (!angular.isDefined($scope.listObject)) {
                    $scope.listObject = {};
                }

                //单个删除
                $scope.delete1 = function(_url, _param) {
                    var _tr = this.tr;
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
                            alertError(error || '删除错误');
                        });
                };
                //批量删除
                $scope.delSelected = function(_url) {
                    dialogConfirm('确定删除这些?', function() {
                        requestData(_url, {
                                ids: $scope.listSelected.join(",")
                            }, 'POST')
                            .then(function() {
                                $scope.$broadcast("reloadList");
                            })
                            .catch(function(error) {
                                alertError(error || '删除错误');
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
                                alertError(error || '删除错误');
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
                //选择当个
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
                var timestamp=null;
                function getListData(_callback) {
                  if(!$attrs.listData)return;

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
                    if (angular.isDefined($attrs.ajaxIfEval)) {
                        var tmp=$scope.$eval($attrs.ajaxIfEval);
                      if (!tmp) return;
                    }

                    if (statusInfo.isLoading) {
                        return;
                    }
                    statusInfo.isLoading = true;

                    $scope.isLoading = statusInfo.isLoading;

                    var maskObj=null;
                    if (!$attrs.noshowLoading) {
                      maskObj=proLoading($element);
                      //  if(maskObj)maskObj.hide();
                    }

                      //时间戳(用于分页查询时避免翻页时数据变动造成重复数据)
                        if(!(statusInfo.currentPage >1)){
                          timestamp=new Date().getTime();
                        }
                    requestData($attrs.listData, angular.merge({}, formData, {
                            timestamp:timestamp,
                            pageNo: statusInfo.currentPage
                        }))
                        .then(function(results) {
                           if(maskObj)maskObj.hide();
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
                                statusInfo.loadFailMsg = data.msg;

                            } else {
                                statusInfo.isFinished = true;
                                statusInfo.loadFailMsg = data.msg;

                            }

                            if ($attrs.callback) {
                                $scope.$eval($attrs.callback);
                            }

                            statusInfo.isLoading = false;
                            $scope.isLoading = false;
                            $timeout(bindSelectOneEvent);
                            if (_callback) {
                                _callback();
                            }
                        })
                        .catch(function(error) {
                           if(maskObj)maskObj.hide();
                            statusInfo.isLoading = false;
                            alertError(error);
                            statusInfo.loadFailMsg = error;
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

                //


                $scope.$watch("listParams", function() {
                    statusInfo.currentPage = 1;
                    statusInfo.isFinished = false;
                    $scope.tbodyList = [];
                    formData = angular.copy($scope.listParams);

                    // if (formData.q) {
                    //   formData.q = "(?i)" + formData.q;
                    // }

                    getListData(setSelectedValue);
                    //清除选择框
                    if ($(".selectAll", $element).length > 0) {
                        $(".selectAll", $element).prop("checked", false).get(0).indeterminate = false;
                    }
                }, true);

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
                          // $(".selectOne", $element).prop("checked", this.checked);
                          // 屏蔽上面的原代码，增加checkbox是否被禁用判断，被禁用不会被选中
                          if ($(".selectOne", $element).attr('disabled') != 'disabled') {
                            $(".selectOne", $element).prop("checked", this.checked);
                          }
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


                    // if(typeof  $scope.beforeGoto == 'function'){
                    //
                    //
                    //     $scope.beforeGoto();
                    //
                    //
                    //     // if(){
                    //     //     $scope.status.currentPage = _page;
                    //     //     $scope.getListData();
                    //     // }
                    // }

                    $scope.status.currentPage = _page;
                    $scope.getListData();

                    // $scope.aftereGoto();
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

                            // console.log($scope.treeList);
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
                var listParamsKey="listParams";
                // 默认的是监听listParams
                if($attrs.listParamsKey){
                    listParamsKey=$attrs.listParamsKey;
                    // 自己指定的
                }

                if (!angular.isDefined($scope[listParamsKey])) {
                   $scope[listParamsKey]= {};
               }

                 var formData = {};
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

                /**
                 * [extendTree2 description]
                 * @param  {[type]} e             [description]
                 * @param  {[type]} childrenDivId [隐藏或显示的孩子展示区]
                 * @param  {[type]} foldClassId   [展开或隐藏样式绑定的divid]
                 * @param  {[type]} foldClass     [自定义添加展开的样式名]
                 * @return {[type]}               [description]
                 */
                $scope.extendTree2 = function(e,childrenDivId,foldClassId,foldClass) {
                  if(!foldClass)foldClass="fold";
                    // e.preventDefault();
                    // e.stopPropagation();
                    // var $this = $(e.currentTarget);
                    var $parentLi =  $("#"+foldClassId);

                    if ($parentLi.hasClass(foldClass)) {
                        $parentLi.removeClass(foldClass);
                         $("#"+childrenDivId).hide();
                    } else {
                        $parentLi.addClass(foldClass);
                       $("#"+childrenDivId).show();
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
                    if(!$attrs.treeList2)return;
                    $scope.status.isLoading = true;
                    requestData($attrs.treeList2,formData)
                        .then(function(results) {
                            var data = results[0];
                            $scope.treeList = buildTree(data,$attrs.pidKey);

                                console.log($scope.treeList);

                            $scope.status.isLoading = false;
                        })
                        .catch(function() {
                            $scope.status.isLoading = false;
                        });
                }
                //   $scope[listParamsKey]
                $scope.$watch(listParamsKey, function() {

                   formData = angular.copy($scope[listParamsKey]);

                    getTreeData();
                }, true);

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
                                if (data[i].selected || (isSelectFirst && i === 0)) {
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
        };
    }
    relativeSelect.$inject = ["requestData", "$timeout"];

    /**
     * 图表
     */
    function eChart(requestData, dialogChart, alertError) {
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

                        if (_data.data) {
                            if (ngModel) {
                              if($attrs.ngModelDataKey){

                                    ngModel.$setViewValue(_data.data[$attrs.ngModelDataKey]);
                              }else{
                                    ngModel.$setViewValue(_data.data);
                              }

                            }

                            if ($scope.clickToUrl) {
                                // ngModel && ngModel.$setViewValue(_data.data);
                                window.location.assign($scope.clickToUrl);
                            } else if ($scope.clickToDialog) {
                                dialogChart($scope.$parent.mainConfig.viewsDir + $scope.clickToDialog);
                            }

                        } else {

                            if ($scope.clickTopToUrl) {
                                // ngModel && ngModel.$setViewValue(_data);
                                if (ngModel) {
                                  ngModel.$setViewValue(_data);
                                }
                                window.location.assign($scope.clickTopToUrl);
                            } else if ($scope.clickTopToDialog) {
                                // ngModel && ngModel.$setViewValue(_data);
                                if (ngModel) {
                                  ngModel.$setViewValue(_data);
                                }
                                dialogChart($scope.$parent.mainConfig.viewsDir + $scope.clickTopToDialog);
                            }

                        }


                    });//end click

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

                    if(Config.serverPath){
                      if (_url.indexOf("http://") !==0 && _url.indexOf("https://") !== 0) {
                        _url=Config.serverPath+_url;
                      }
                    }

                    $.ajax({
                      url: _url,
                      type: "GET",
                      xhrFields:{withCredentials: true},
                      crossDomain:true,
                      dataType: 'text',//text,json
                      success: function (text) {
                          myChart.hideLoading();
                          $scope.isLoading = false;
                        // var results=eval(text);
                        //eavl 作用域设置为当前，支持执行echart提供方法。
                        var results = eval( "(" + text + ")" );


                        // if ( results.code != 200) {
                        //     // console.log(_data);
                        //       alertError(results.message || '出错了');
                        //     return ;
                        //
                        // }

                        var _data = results.data;
                        if(!_data)return;
                        //js api 增加功能：eChart组件将data返回给$scope.$parent.eChartMapData[$scope.eChartKey] 用于显示数据。
                        if ($scope.eChartKey) {
                            if (!$scope.$parent.eChartMapData) $scope.$parent.eChartMapData = {};
                            $scope.$parent.eChartMapData[$scope.eChartKey] = _data;
                        }


                        //解决百度图表雷达图 Tip 显示不正确的问题
                        if (_data.polar) {
                            _data.tooltip.formatter = function(_items) {
                                var _str = _items[0].name;
                                angular.forEach(_items, function(_item) {
                                    _str += '<br>' + _item.seriesName + ": " + _item.data;
                                });
                                return _str;
                            };
                        } else {
                            if (_data.tooltip&&_data.tooltip.formatter && _data.tooltip.formatter.indexOf("function") === 0) {
                                _data.tooltip.formatter = eval("(" + _data.tooltip.formatter + ")");
                            }
                        }
                        myChart.setOption(_data);

                      },
                      error:function(res){
                          $scope.isLoading = false;
                        //{readyState: 0, responseText: "", status: 0, statusText: "error"}
                          // alert("服务器连接不上或内部异常："+res.responseText);
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
    }
    eChart.$inject = ["requestData", "dialogChart", "alertError"];

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
                "classDescription": "@",
                //"localData": "=?",
                "ngModelId": "=?",//绑定返回对象id
                "ngModel": "=",
                "searchFields": "@",
                "matchClass": "@",
                "searchStrClass": "@",
                "ngDisabled": "=?",
                "inputStyle": '@'  // 自定义input样式
            },
            require: "?^ngModel",
            templateUrl: Config.tplPath + 'tpl/autocomplete.html',
            link: function($scope, elem, $attrs, ngModel) {
                $scope.lastSearchTerm = null;
                $scope.currentIndex = null;
                $scope.justChanged = false;
                $scope.searchTimer = null;
                $scope.hideTimer = null;
                $scope.searching = false;
                $scope.pause = 300;
                $scope.minLength = 1;
                $scope.searchStr = $scope.searchFields;

                if($attrs.ngModelId){
                  $scope.$watch("ngModel", function(value) {
                    console.log("ngModelProperty.watch.ngModel",value);
                    if(!value){
                      $scope.ngModelId=null;
                    }else{
                        $scope.ngModelId=value.id;
                    }


                  }, true);
                }
              require(['project/angucomplete'], function(angucomplete) {
                    $scope.angucomplete1=new angucomplete($scope,elem,$parse, requestData, $sce, $timeout,ngModel);

              });//angucomplete

            }//end link
        };
    }

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
                });
            }
        };
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
    function chosen(requestData, $timeout, $rootScope, alertError, proLoading,utils) {
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
                display_selected_options: false,
                default_single_text: "选择一个..."
            };

            //后缀连接符号
            var suffixConnection=$attrs.suffixConnection||"";

            //后缀连接数据得key
            var suffixKey=$attrs.suffixKey||"";

            // 根据条件判断是否屏蔽下拉选择
            if (angular.isDefined($attrs.isDisabledThis)) {
              $attrs.$observe('isDisabledThis', function (newVal, oldVal) {
                if (!newVal) {
                  // $element.attr('disabled', true);
                }

                if (newVal && newVal != oldVal) {
                  // $element.removeAttr('disabled');
                }
              });
            }

           //设置选中值。1.设置优先级为：ngModel》defaultEmpty》data[0]
           //data 是返回的option 对象数组
           function getInitSelected (data){
             var _selected=null;
             var data0Val=data[0]?data[0].value:null;


             if(angular.isDefined($attrs.chosenAjax)){//解决展开后，默认选中一个，导致只显示一个数据bug
               data0Val=null;
             }

             if(angular.isDefined($attrs.multiple)){
                 if (angular.isDefined($attrs.defaultEmpty)) {
                    _selected= ngModel.$viewValue ? ngModel.$viewValue : [];
                 } else {
                     _selected= ngModel.$viewValue ? ngModel.$viewValue : [data0Val];
                 }
             } else {
                if (angular.isDefined($attrs.defaultEmpty)) {
                 _selected= ngModel.$viewValue ? ngModel.$viewValue :"";
                } else {
                  _selected= ngModel.$viewValue ? ngModel.$viewValue : data0Val;

                }
             }
              ngModel.$setViewValue(_selected);

              if (_selected===null) {
                _selected = "";
              }

              return _selected;
           }

           //创建option数据
           function createOptionsStr(data, _selected){

              var _options = '';

              if(_selected===null) _selected="";

              if(!angular.isDefined($attrs.multiple)){//array 类型不用修改。
                  _selected=_selected+"";//解决true 的情况，转换成"true"字符串
              }


              if (angular.isDefined($attrs.defaultEmpty)) {
                  _options += '<option value=""  >' + $attrs.defaultEmpty + '</option>';
              }

              //记录需要过滤的数据value，场景选择多个批次情况，同一批次只能选择一次.过滤掉要已已经选过的数据。当前选中的批次不过滤。
              var hideSelectValueArray=null;

              if( $attrs.callbackFilterReturnData){
                hideSelectValueArray = $scope.$eval($attrs.callbackFilterReturnData);
                // console.log(hideSelectValueArray);
              }

              for (var i = 0; i < data.length; i++) {
                  var selectedFlag=false;
                  if(angular.isArray(_selected)){
                     selectedFlag=_selected.indexOf(data[i].value)> -1;
                  }else{
                       selectedFlag=(_selected==data[i].value);
                  }


                  //记录需要过滤的数据value，场景选择多个批次情况，同一批次只能选择一次.过滤掉要已已经选过的数据。当前选中的批次不过滤。
                  if(!selectedFlag&&hideSelectValueArray){
                    if(hideSelectValueArray.indexOf(data[i].value)> -1){
                        //  console.log(data[i].value);
                        continue;
                    }
                  }


                var text=data[i].text;
                  if(suffixKey){//添加额外属性
                    suffixKeyVal=utils.getObjectVal(data[i],suffixKey);
                    if(suffixKeyVal!=null||suffixKeyVal!=undefined){
                      text+=suffixConnection+suffixKeyVal;
                    }
                  }
                  _options += '<option value="' + data[i].value + '" ' + (selectedFlag ? 'selected' : '') + '>' + text + '</option>';
              }

              return _options;

           }

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

            if ($attrs.width) {
              chosenConfig.width = $attrs.width;
            }
              //记录返回数据
            var dataArr=null;

            require(['chosen'], function() {


            //监听变化
            function watchNgModel(callback){

              //只有复选框 的时候才调用该方法
              // 监听一个model 当一个model清空时,重置chosen 选择数据
              //model 变化时，触发回调方法。
              if ($attrs.ngModel &&(!angular.isDefined($attrs.multiple))) {
                $scope.$watch($attrs.ngModel, function(newValue, oldValue) {

                      // console.log("watch,$attrs.ngModel1");
                        if(!chosenObj|| newValue==oldValue)return;

                        try{
                            var chosen=chosenObj.data("chosen");
                            if(!chosen)return;
                            if(!chosen.results_data||chosen.current_selectedIndex<0)return;
                            chosen.results_data[chosen.current_selectedIndex];
                            // console.log("watch,$attrs.ngModel2");


                              if(callback)callback();

                              if ($attrs.selectData){
                                var selData=utils.getObjectByKeyOfArr(dataArr,"value",newValue);
                                $scope[$attrs.selectData] = selData;
                              }
                              // $scope.$apply();
                              if ($attrs.callback) {
                                  $scope.$eval($attrs.callback);
                              }
                        }catch(e){}

                });
              }//  if ($attrs.ngModel)
            }//watchNgModel


            //销毁组件
            function destroyChosen(chosenObj){
              try{
                  chosenObj&&chosenObj.data("chosen").destroy();
              }catch(e){}
            }

            if ($attrs.selectSource) {

              var _params={};
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
                  if ($attrs.params) {
                      if ($attrs.params.indexOf("{") === 0) {
                            _params = $scope.$eval($attrs.params);
                      }
                  }
                        var maskObj=null;
                    var selected = $('option:selected', $element).not(':empty').clone().attr('selected', true);
                    if (requestQueue) {
                      requestQueue.abort();
                      if(maskObj)maskObj.hide();
                    }
                     maskObj=  proLoading($element, "chosen");
                     if(!q)q='';
                     _params.q=q;
                     _params.id=ngModel.$viewValue;
                    requestQueue = $.ajax({
                        url: _url,
                        type: 'GET',
                        xhrFields:{withCredentials: true},
                        crossDomain:true,
                        data: _params,
                        dataType: 'json',
                        success: function(_data) {
                            if(maskObj)maskObj.hide();
                          if (_data.code == 200) {
                            $rootScope.isLoading = false;

                            if (!_data.data) _data.data = [];

                            dataArr=_data.data;
                            if(_data.data.length === 0){
                              _data.data.push({value:"",text:""});
                            }



                            var _length = _data.data.length;

                            var data= _data.data;


                            var _selected=getInitSelected(data);

                            var _options=createOptionsStr(data,_selected);

                            // for (var i = 0; i < _length; i++) {
                            //     // var data= _data.data;
                            //     // if (_selected.indexOf(_data.data[i].value) == -1) {
                            //     //     _options += '<option value="' + _data.data[i].value + '">' + _data.data[i].text + '</option>';
                            //     // }
                            //
                            //     _options += '<option value="' + data[i].value + '"' + (_selected.indexOf(data[i].value) > -1 ? 'selected' : '') + '>' + data[i].text + '</option>';
                            //
                            // }
                            $element.html(_options);
                            // .prepend(selected);
                            $element.trigger("chosen:updated");
                            var keyRight = $.Event('keydown');
                            keyRight.which = 39;
                            //0000879: 输入客户名后删除以正常速度（1S删除一个字）删除完所有字后会自动再带出第一个字
                            // console.log(q);
                              searchStr=q;
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
                        error:function(res){
                            if(maskObj)maskObj.hide();
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
                  //0000879: 输入客户名后删除以正常速度（1S删除一个字）删除完所有字后会自动再带出第一个字
                  // if (!q && searchStr == q) {
                  //   return false;
                  // }
                  if (searchStr == q) {
                    return false;
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


                  if($attrs.isEmptyQuery=="true"){
                        handleSearch('');
                  }


                  watchNgModel(handleSearch);

                  // if ($attrs.params) {
                  //
                  //   firstSelectSource=$attrs.params;
                  //     if ($attrs.params.indexOf("{") === 0) {
                  //         //监听具体值
                  //         $attrs.$observe("params", function(value) {
                  //
                  //             _params = $scope.$eval(value);
                  //             if(firstSelectSource==value)return;
                  //
                  //                 firstSelectSource=value;
                  //               ngModel.$setViewValue(null);
                  //
                  //             getData(_params);
                  //         });
                  //           _params = $scope.$eval($attrs.params);
                  //     } else {
                  //         //监听对象
                  //         $scope.$watch($attrs.params, function(value) {
                  //             _params = value;
                  //             if(firstSelectSource==value)return;
                  //               ngModel.$setViewValue(null);
                  //
                  //             handleSearch('');
                  //         }, true);
                  //           _params = $attrs.params;
                  //     }
                  // } else {
                  //   $attrs.$observe("selectSource", function(value) {
                  //       //修复初始化  ngModel.$setViewValue 值的情况下，先chosen 导致设置ngModel.$setViewValue为null的bug。
                  //       if(firstSelectSource==value)return;
                  //         ngModel.$setViewValue(null);
                  //
                  //       // chosenObj&&chosenObj.data("chosen").single_set_selected_text();
                  //         handleSearch('');
                  //   });
                  // }
                }//end ajax

                 else {
                  var firstSelectSource=$attrs.selectSource;


                  if ($attrs.params) {

                    firstSelectSource=$attrs.params;
                      if ($attrs.params.indexOf("{") === 0) {
                          //监听具体值
                          $attrs.$observe("params", function(value) {

                              _params = $scope.$eval(value);
                              if(firstSelectSource==value)return;

                                  firstSelectSource=value;
                                ngModel.$setViewValue(null);

                              getData(_params);
                          });
                            _params = $scope.$eval($attrs.params);
                      } else {
                          //监听对象
                          $scope.$watch($attrs.params, function(value) {
                              _params = value;
                              if(firstSelectSource==value)return;
                                ngModel.$setViewValue(null);

                              getData(_params);
                          }, true);
                            _params = $attrs.params;
                      }
                  } else {
                    $attrs.$observe("selectSource", function(value) {

                        // 修复初始化  ngModel.$setViewValue 值的情况下，先chosen 导致设置ngModel.$setViewValue为null的bug。
                        if (!$attrs.noFirstSelectSource) {
                          if (firstSelectSource == value) return;
                        }

                        ngModel.$setViewValue(null);

                        // chosenObj&&chosenObj.data("chosen").single_set_selected_text();
                        getData();
                    });
                  }

                  function getData(){
                    //满足条件才异步请求
                    if (angular.isDefined($attrs.ajaxIf)) {

                      if ($attrs.ajaxIf.indexOf("{") === 0) {//IE下用
                        var tmp=$scope.$eval($attrs.ajaxIf);
                        if (!tmp) return;
                      }

                      if (!$attrs.ajaxIf) return;
                    }
                    if (angular.isDefined($attrs.ajaxIfEval)) {
                        var tmp=$scope.$eval($attrs.ajaxIfEval);
                      if (!tmp) return;
                    }

                    requestData($attrs.selectSource,_params)
                      .then(function(results) {
                          var data = results[0];

                          //如果已定义请求数据后的回调，执行回调
                          if ($attrs.callBack) {
                            $scope.$eval($attrs.callBack);
                          }

                          if (!data) data = [];

                          dataArr=data;

                          var _length = data.length;
                          //  var _selected = angular.isArray(ngModel.$viewValue) ? ngModel.$viewValue : [data[0].value];

                          // var _selected=null;
                          // var data0Val=data[0]?data[0].value:null;
                          // if(angular.isDefined($attrs.multiple)){
                          //     if (angular.isDefined($attrs.defaultEmpty)) {
                          //        _selected= ngModel.$viewValue ? ngModel.$viewValue : [];
                          //     } else {
                          //         _selected= ngModel.$viewValue ? ngModel.$viewValue : [data0Val];
                          //     }
                          // } else {
                          //    if (angular.isDefined($attrs.defaultEmpty)) {
                          //     _selected= ngModel.$viewValue ? ngModel.$viewValue :"";
                          //    } else {
                          //      _selected= ngModel.$viewValue ? ngModel.$viewValue : data0Val;
                          //
                          //    }
                          // }
                          // if(_selected==null)_selected="";

                          var _selected=getInitSelected(data);
                          var _options=createOptionsStr(data,_selected);
                          //
                          // if (angular.isDefined($attrs.defaultEmpty)) {
                          //     _options += '<option value=""  >' + $attrs.defaultEmpty + '</option>';
                          // }
                          // for (var i = 0; i < _length; i++) {
                          //     _options += '<option value="' + data[i].value + '"' + (_selected.indexOf(data[i].value) > -1 ? 'selected' : '') + '>' + data[i].text + '</option>';
                          // }
                          $element.html(_options);
                          destroyChosen(chosenObj);
                          chosenObj=$element.chosen($scope.chosen || chosenConfig);
                          ngModel.$setViewValue(_selected);
                      }).catch(function(msg) {
                          if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                          if (angular.isDefined($attrs.alertError)) alertError(msg);
                      });
              }

              watchNgModel(getData);


              $scope.$watch($attrs.clearWatchScope, function(newValue, oldValue) {
                if(chosenObj ){
                  getData();

                }
              });

              getData();

              }
            } else {
            //修复select 初始值为null，没有对应的option值时，angluarjs自动添加，空option 导致 chonsen控件，选择其他值后，不能选择最后一条bug。
            $element.append("<option value=''></option>");
            $element.chosen($scope.chosen || chosenConfig);
              }
            });
          }
        };
    }



        /**
          * 下拉
          pg-select
          <select ng-if="initFlag"  class="select select-w"
                  data-placeholder="选择机构"
                    pg-select
                  ng-model="formData.organizationId"
                  default-empty="无"
                  alert-error
                  select-source="rest/index/distributor/queryForSelectOption.json">
          </select>
          */
        function pgSelect(requestData, $timeout, $rootScope, alertError, proLoading,utils) {
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
                    display_selected_options: false,
                    placeholder_text_single: "选择一个..."
                };

                //后缀连接符号
                var suffixConnection=$attrs.suffixConnection||"";

                //后缀连接数据得key
                var suffixKey=$attrs.suffixKey||"";

                // 根据条件判断是否屏蔽下拉选择
                if (angular.isDefined($attrs.isDisabledThis)) {
                  $attrs.$observe('isDisabledThis', function (newVal, oldVal) {
                    if (!newVal) {
                      // $element.attr('disabled', true);
                    }

                    if (newVal && newVal != oldVal) {
                      // $element.removeAttr('disabled');
                    }
                  });
                }

               //设置选中值。1.设置优先级为：ngModel》defaultEmpty》data[0]
               //data 是返回的option 对象数组
               function getInitSelected (data){
                 var _selected=null;
                 var data0Val=data[0]?data[0].value:null;


                 if(angular.isDefined($attrs.chosenAjax)){//解决展开后，默认选中一个，导致只显示一个数据bug
                   data0Val=null;
                 }

                 if(angular.isDefined($attrs.multiple)){
                     if (angular.isDefined($attrs.defaultEmpty)) {
                        _selected= ngModel.$viewValue ? ngModel.$viewValue : [];
                     } else {
                         _selected= ngModel.$viewValue ? ngModel.$viewValue : [data0Val];
                     }
                 } else {
                    if (angular.isDefined($attrs.defaultEmpty)) {
                     _selected= ngModel.$viewValue ? ngModel.$viewValue :"";
                    } else {
                      _selected= ngModel.$viewValue ? ngModel.$viewValue : data0Val;

                    }
                 }
                  ngModel.$setViewValue(_selected);

                  if (_selected===null) {
                    _selected = "";
                  }

                  return _selected;
               }

               //创建option数据
               function createOptionsStr(data, _selected){

                  var _options = '';

                  if(_selected===null) _selected="";
                  if(!angular.isDefined($attrs.multiple)){//array 类型不用修改。
                      _selected=_selected+"";//解决true 的情况，转换成"true"字符串
                  }

                  if (angular.isDefined($attrs.defaultEmpty)) {
                      _options += '<option value=""  >' + $attrs.defaultEmpty + '</option>';
                  }

                  //记录需要过滤的数据value，场景选择多个批次情况，同一批次只能选择一次.过滤掉要已已经选过的数据。当前选中的批次不过滤。
                  var hideSelectValueArray=null;

                  if( $attrs.callbackFilterReturnData){
                    hideSelectValueArray = $scope.$eval($attrs.callbackFilterReturnData);
                    // console.log(hideSelectValueArray);
                  }

                  for (var i = 0; i < data.length; i++) {
                      var selectedFlag=false;
                      if(angular.isArray(_selected)){
                         selectedFlag=_selected.indexOf(data[i].value)> -1;
                      }else{
                           selectedFlag=(_selected==data[i].value);
                      }

                      //记录需要过滤的数据value，场景选择多个批次情况，同一批次只能选择一次.过滤掉要已已经选过的数据。当前选中的批次不过滤。
                      if(!selectedFlag&&hideSelectValueArray){
                        if(hideSelectValueArray.indexOf(data[i].value)> -1){
                            //  console.log(data[i].value);
                            continue;
                        }
                      }

                    var text=data[i].text;
                      if(suffixKey){//添加额外属性
                        suffixKeyVal=utils.getObjectVal(data[i],suffixKey);
                        if(suffixKeyVal!=null||suffixKeyVal!=undefined){
                          text+=suffixConnection+suffixKeyVal;
                        }
                      }
                      _options += '<option value="' + data[i].value + '" ' + (selectedFlag ? 'selected' : '') + '>' + text + '</option>';
                  }

                  return _options;

               }
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

                  //记录返回数据
                var dataArr=null;


                //监听变化
                function watchNgModel(callback){

                  //只有复选框 的时候才调用该方法
                  // 监听一个model 当一个model清空时,重置chosen 选择数据
                  //model 变化时，触发回调方法。
                  if ($attrs.ngModel &&(!angular.isDefined($attrs.multiple))) {
                    $scope.$watch($attrs.ngModel, function(newValue, oldValue) {
                            if(newValue==oldValue)return;
                            try{
                                  if(callback)callback();
                                  if ($attrs.selectData){
                                    var selData=utils.getObjectByKeyOfArr(dataArr,"value",newValue);
                                    $scope[$attrs.selectData] = selData;
                                  }
                                  // $scope.$apply();
                                  if ($attrs.callback) {
                                      $scope.$eval($attrs.callback);
                                  }
                            }catch(e){}

                    });
                  }//  if ($attrs.ngModel)
                }//watchNgModel
                var _params=null;
                if (!$attrs.selectSource) {return}
                var firstSelectSource=$attrs.selectSource;

               if ($attrs.params) {
                  firstSelectSource=$attrs.params;
                   if ($attrs.params.indexOf("{") === 0) {
                       //监听具体值
                       $attrs.$observe("params", function(value) {
                           _params = $scope.$eval(value);
                           if(firstSelectSource==value)return;
                               firstSelectSource=value;
                             ngModel.$setViewValue(null);
                           getData(_params);
                       });
                         _params = $scope.$eval($attrs.params);
                   } else {
                       //监听对象
                       $scope.$watch($attrs.params, function(value) {
                           _params = value;
                           if(firstSelectSource==value)return;
                             ngModel.$setViewValue(null);

                           getData(_params);
                       }, true);
                     _params = $attrs.params;
                   }

               } else {
                 $attrs.$observe("selectSource", function(value) {
                     //修复初始化  ngModel.$setViewValue 值的情况下，先chosen 导致设置ngModel.$setViewValue为null的bug。
                     if(firstSelectSource==value)return;
                       ngModel.$setViewValue(null);

                     getData();
                 });
               }

                   function getData(){
                     //满足条件才异步请求
                     if (angular.isDefined($attrs.ajaxIf)) {

                       if ($attrs.ajaxIf.indexOf("{") === 0) {//IE下用
                         var tmp=$scope.$eval($attrs.ajaxIf);
                         if (!tmp) return;
                       }

                       if (!$attrs.ajaxIf) return;
                     }
                     if (angular.isDefined($attrs.ajaxIfEval)) {
                         var tmp=$scope.$eval($attrs.ajaxIfEval);
                       if (!tmp) return;
                     }

                     requestData($attrs.selectSource,_params)
                       .then(function(results) {
                           var data = results[0];

                           //如果已定义请求数据后的回调，执行回调
                           if ($attrs.callBack) {
                             $scope.$eval($attrs.callBack);
                           }

                           if (!data) data = [];

                           dataArr=data;

                           var _length = data.length;

                           var _selected=getInitSelected(data);
                           var _options=createOptionsStr(data,_selected);

                           $element.html(_options);

                           ngModel.$setViewValue(_selected);
                       }).catch(function(msg) {
                           if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                           if (angular.isDefined($attrs.alertError)) alertError(msg);
                       });
               }//   function getData()

                watchNgModel(getData);


                 $scope.$watch($attrs.clearWatchScope, function(newValue, oldValue) {
                   getData();
                 });

             getData();
           }
         }
        }//end pg-select

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
                      cacheLength:0,
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
                var clickHideEvent=function(e) {

                    // console.log("clickHideEvent");
                    if($(e.target).closest(".select-address").length == 0){
                        //实现点击某元素之外触发事件
                              if(popup){
                                    popup.hide();
                              };

                        }


                      // event.stopPropagation();
                      // return false;//导致form表单不能提交
                  };
                popup = {
                    element: null,
                    backdrop: null,
                    show: function() {
                        $(document).on('click', clickHideEvent);
                        return this.element.addClass('active');
                    },
                    hide: function() {
                        this.element.removeClass('active');
                          $(document).unbind('click', clickHideEvent);
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



                      // $(document).unbind('click', clickHideEvent);




//                        $(window).on('click', (function(_this) {
//                            return function() {
//                                return _this.hide();
//                            };
//                        })(this));

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
                        scope.d = null;

                          scope.cities=[];
                          scope.dists=[];

                    };
                    scope.submitAddress = function() {
                        return popup.hide();
                    };
                    scope.$watch('p', function(newV) {
                        var v, _i, _len, _results;
                        _results = [];
                        if (newV) {

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


    /**
    /**
    必填参数：
    attrs.ajaxUrlSubmit=""：请求数据参数
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

    */
    function ajaxUrlSubmit($timeout, requestData, alertOk, alertError, proLoading, modal,utils) {
        return {
            restrict: 'AE',
            // scope: true,
            // transclude: true,
            link: function($scope, $element, $attrs, $ctrls, $transclude) {
                // $transclude($scope, function(clone) {
                //     $element.append(clone);
                // });

                $scope.ajaxUrlHandler = $scope.$eval($attrs.ajaxUrlHandler);

                function getData(params) {
                  //满足条件才异步请求
                  if (angular.isDefined($attrs.ajaxIf)) {
                    if (!$attrs.ajaxIf) return;
                  }

                  if (angular.isDefined($attrs.ajaxIfEval)) {
                    var tmp = $scope.$eval($attrs.ajaxIfEval);
                    if (!tmp) return;
                  }
                  $scope.isLoading = true;
                    var maskObj=null;
                    if (!$attrs.noshowLoading) {
                      maskObj=proLoading($element);
                      //  if(maskObj)maskObj.hide();
                    }
                   var parameterBody = false;
                   if (angular.isDefined($attrs.parameterBody)) parameterBody = true;

                   if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] ="";


                   var httpMethod = "POST";
                   if($attrs.httpMethod){
                     httpMethod=$attrs.httpMethod;
                   }

                   requestData($attrs.ajaxUrlSubmit, params, httpMethod, parameterBody)
                     .then(function(results) {
                           if(maskObj)maskObj.hide();

                          $scope.isLoading = false;
                         var data = results[0];

                         if ($scope.ajaxUrlHandler) {
                             data = $scope.ajaxUrlHandler(data);
                         }

                         if ($attrs.scopeResponse) $scope[$attrs.scopeResponse] = results[1];
                        //  if ($attrs.scopeData) $scope[$attrs.scopeData] = data;
                         if ($attrs.scopeData){
                             if(!$scope[$attrs.scopeData]) {
                               if(angular.isArray(results[0])){
                                 $scope[$attrs.scopeData]=[];//数组extend 会把数组转化成对象。
                               }else{
                                 $scope[$attrs.scopeData]={};
                               }

                             }
                             utils.replaceObject($scope[$attrs.scopeData],results[0]);
                             // angular.extend(  $scope[$attrs.scopeData],  results[0]);//
                         }
                         if (angular.isDefined($attrs.alertOk)) alertOk(results[1].msg);

                         //回调父级的处理事件;
                         if ($scope.listCallback) {
                           $scope.listCallback(results[1]);
                         }

                         // $scope.$apply();
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


                         //自动关闭弹窗
                         if (angular.isDefined($attrs.autoCloseDialog)) {
                           modal.close();
                         }

                     })
                     .catch(function(msg) {
                           if(maskObj)maskObj.hide();
                        if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                        if (angular.isDefined($attrs.alertError)) alertError(msg);

                        if ($attrs.errorCallback) {
                             $scope.$eval($attrs.callback);
                            // $scope.$eval($attrs.errorCallback);
                        }

                        $('.pr-full-loading').remove();
                     });

                }

                $element.on("click", function () {
                  var _params = {};
                  if ($attrs.params) {
                    if ($attrs.params.indexOf("{") === 0) {
                      _params = $scope.$eval($attrs.params);
                    } else {
                      _params = $scope.$parent[$attrs.params];
                    }
                  }

                  getData(_params);
                });

            }
        };
    }

    //验证失败的提示窗口
    function invalidPopover () {
        return {
            restrict: 'A',
            scope: {
                isFocus: '@?',
                ngModel: '=?',
                popoverOptions: '@',
                validValue: '@',
                popoverShow: '=?'
            },
            link: function ($scope, element, $attrs) {
              if($scope.isFocus){
                  element.data("isFocus", true);
              }
              function showDo(show){
                if ( element.data("isFocus")&&show=="true") {
                  element.popover('show');
                } else {
                  element.popover('hide');
                }
              }

              var placement = $attrs.placement ? $attrs.placement : "right";
              var popoverOptions='{ "placement": "'+placement+'", "trigger": "manual" }';

              if($attrs.popoverOptions)popoverOptions=$attrs.popoverOptions;
              element.popover(JSON.parse(popoverOptions));

              if(angular.isDefined($attrs.validValue)){
                $scope.$watch('ngModel', function (newVal, oldVal) {
                  // console.log($attrs.validValue);
                  if ($attrs.validValue=="true") {
                    element.popover('show');
                  } else {
                    element.popover('hide');
                  }
                });
              }

              if ($attrs.popoverShow) {
                $scope.$watch('popoverShow', function (newVal, oldVal) {
                  if (newVal) {
                    element.popover('show');
                  } else {
                    element.popover('hide');
                  }
                });
              } else {
                element.focus(function(){
                  //获取焦点时才条件验证。
                  element.data("isFocus", true);
                  if(angular.isDefined($attrs.validValue)){
                      if ($attrs.validValue=="true") {
                        element.popover('show');
                      } else {
                        element.popover('hide');
                      }
                  }else{
                    showDo($attrs.invalidPopover);
                  }

                });

                $attrs.$observe('invalidPopover', function (show) {
                  showDo(show);
                });
              }
            }
        };
    }



    /**
     * 树状列表
     */
    function watchFormChange(watchFormChange) {
        return {
            restrict: 'AE',
            link: function($scope, $element, $attrs, ngModel) {
              $scope.watchFormChange=function(watchName){
                watchFormChange(watchName,$scope);
              }

            }
        }
    };

    /**
     * 日期控件
     formData.expectDate：136000000单位 毫秒
     <input type="text" class="ipt pr-short-ipt color-6" placeholder="期望到货时间"
     readonly="true"
     datepicker   ng-model="formData.expectDate">

     formData.expectDate：2017-01-01 格式
     <input type="text" class="ipt pr-short-ipt color-6" placeholder="期望到货时间"
     readonly="true" no-parser="true"
     datepicker   ng-model="formData.expectDate">
     */
    function datepicker($filter) {
      'use strict';
      return {
        restrict:'EA',
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModel) {

          // 初始化配置
          var config = null;
          // 根据配置是否需要选择时分
          config = angular.isDefined($attrs.timePicker) ? { format:'YYYY-MM-DD HH:mm' } : { format:'YYYY-MM-DD' }

          //默认日期绑定数据单位都是 milliseconds。如果yy-mm-dd 需要设置noParser="true"
          if($attrs.noParser!="true"){
            var moment = require('moment');
            var _format=$attrs.format||config.format;

            ngModel.$parsers.push(function(val) {
              if (!val) return;
              // var tt=moment(val, _format).millisecond();
                var tt=moment(val, _format).format('x');

              return tt;
            });

            //
            ngModel.$formatters.push(function() {
              if (!ngModel.$modelValue) return null;
              var tmp=ngModel.$modelValue;
              var time=moment(parseInt(tmp,10)).format(_format);

              return time;
            });


          }//$attrs.noParser!="true"

          $.datepicker.regional['zh-CN'] = {
            closeText: '关闭',
            prevText: '<上月',
            nextText: '下月>',
            currentText: '今天',
            monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
            dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
            dayNamesMin: ['日','一','二','三','四','五','六'],
            weekHeader: '周',
            dateFormat: 'yy-mm-dd',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: true,
            yearSuffix: '年'
          };

          $.datepicker.setDefaults($.datepicker.regional['zh-CN']);

          if (angular.isDefined($attrs.timePicker)) {
            $element.prop("readonly", true).datetimepicker({
                changeYear : true ,
                changeMonth  : true ,
                dateFormat:'yy-mm-dd',
                monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
                dayNamesMin: ['日','一','二','三','四','五','六'],
                timeText: '时间',
                hourText: '小时',
                minuteText: '分钟',
                secondText: '秒',
                currentText: '现在',
                closeText: '完成',
                showSecond: false, //显示秒
                timeFormat: 'HH:mm' //格式化时间
            });
          } else {
            $element.datepicker({
              changeYear : true ,
              changeMonth  : true ,
              dateFormat:'yy-mm-dd',
              monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
              dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
              dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
              dayNamesMin: ['日','一','二','三','四','五','六'],
              prevText: 'Earlier',
              onSelect:function(val){
                $scope.$apply(function(){
                	ngModel.$setViewValue(val);
                });
              }
      			});
          }

        }
      }
    };

    /**
     * [textInterception 自定义指令为过长内容进行截取，解决CSS3里ellipsis属性会将下划线隐藏掉的问题]
     * @return {[type]} [description]
     * @author liuzhen
     */
    function textInterception () {
      'use strcit';
      return {
        restrict: 'A',
        scope: true,
        link: function ($scope, $element, $attrs) {
          // 获取当前元素宽度
          var _w = $element.width();
          // 为当前元素设置固定宽度和高度
          $element.css({'width':_w, 'height':'auto', 'margin-left':'auto', 'margin-right':'auto'});
          // 获取需要显示的字符数
          var _showCharNum = parseInt(_w/19, 10);

          var _resStr,
              _str = $attrs.textInterception;

          if (_str.length > _showCharNum) {
            _resStr = _str.slice(0, _showCharNum) + '...';
            $scope.tr.firstMedical.name = _resStr;
            // $scope[$attrs.fieldName] = _resStr;
          }

        }
      }
    }

    //AngularJS动态显示不同的html内容。
    function ngCompile2($compile) {
      // directive factory creates a link function
      return function($scope, $element, attrs) {
        $scope.$watch(
          function($scope) {
             // watch the 'compile' expression for changes
            return $scope.$eval(attrs.ngCompile2);
            //
            // if(tmp){
            //   console.log(tmp);
            // }
            //  return tmp;
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            // if(value){
            //   console.log(value);
            // }
            $element.html(value);
            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves

            $compile($element.contents())($scope );
          }
        );
      };
    }

    /**
        树形
    */
    function zTree(requestData, alertOk, alertError, proLoading,utils) {

      function zTree_init($element,zNodes,$scope){
        var setting = {
            data: {
          		simpleData: {
          			enable: true,
          			idKey: $scope.idKey||"id",
          			pIdKey: $scope.pIdKey||"pId",
          			rootPId: "",
          		}
          	},
            callback: {
              onClick: function(event, treeId, treeNode) {
                  console.log(treeNode);
                  $scope.ngModel=treeNode.id;
                  $scope.selectTreeNode=treeNode;
                  $scope.$apply();
              }
            }
          };
          require(['ztree'], function(store) {

            var treeObj= $.fn.zTree.init($element, setting, zNodes);

            //自动展开选中项。用于重新加载数据后，定位到数据
            if($scope.selectTreeNode){
                treeObj.selectNode($scope.selectTreeNode);
                        // treeObj.expandNode($scope.selectTreeNode, true, true, true);
            }
            //使用广播方式，操作ztree节点
              //添加节点 modify by liumingquan
            $scope.$on("zTreeAddNode", function(evt,node) {
                  console.log('$scope.$on("zTreeAddNode",',evt,node);
                var parntId=node[setting.data.simpleData.pIdKey];
                  var parentNode = treeObj.getNodeByParam(setting.data.simpleData.idKey, parntId, null);
                node = treeObj.addNodes(parentNode, node);
                // if(node)treeObj.selectNode(node);
            });

            //更新节点  modify by liumingquan
            $scope.$on("zTreeUpdateNode", function(evt,node) {
                console.log('$scope.$on("zTreeUpdateNode",',evt,node);
                  var id=node[setting.data.simpleData.idKey];
                var treeNode = treeObj.getNodeByParam(setting.data.simpleData.idKey, id, null);
                if(treeNode==null){//tree中没有，说明是新添加的，
                    var parntId=node[setting.data.simpleData.pIdKey];
                    var parentNode = treeObj.getNodeByParam(setting.data.simpleData.idKey, parntId, null);
                  treeObj.addNodes(parentNode, node);
                }else{
                  $.extend( true,treeNode,  node);
                  treeObj.updateNode(treeNode);
                }


            });
            //删除节点  modify by liumingquan
            $scope.$on("zTreeRemoveNode", function(evt,id) {
                  console.log('$scope.$on("zTreeRemoveNode",',evt,id);

                var node = treeObj.getNodeByParam(setting.data.simpleData.idKey, id, null);

                if(node)treeObj.removeNode(node);
            });
            // 刷新整个节点 modify by liumingquan
            $scope.$on("zTreeReloadData", function() {
               //  getData(_detailsParams);
               getData({});

            });

          });//require
      }
      return {
        restrict: 'EA',
        scope: {
          "ngModel":"=?",
          "selectTreeNode":"=?",
          "idKey":"@?",
          "pIdKey":"@?"
        },
        link: function ($scope, $element, $attrs) {
          var urlKey="zTree";
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
              $attrs.$observe(urlKey, function(value) {
                  getData({});
              });
          }

          function getData(params) {
             //满足条件才异步请求
             if (angular.isDefined($attrs.ajaxIf)) {
               if (!$attrs.ajaxIf) return;
             }
             if (angular.isDefined($attrs.ajaxIfEval)) {
                 var tmp=$scope.$eval($attrs.ajaxIfEval);
               if (!tmp) return;
             }
             $scope.isLoading = true;
             var maskObj=null;
             if (!$attrs.noshowLoading) {
               maskObj=proLoading($element);
               //  if(maskObj)maskObj.hide();
             }
            if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] ="";
             requestData($attrs[urlKey], params)
               .then(function(results) {
                     if(maskObj)maskObj.hide();
                   var data = results[0];
                   zTree_init($element,data,$scope);

                   if ($attrs.scopeResponse) $scope[$attrs.scopeResponse] = results[1];

                   if (angular.isDefined($attrs.alertOk)) alertOk(results[1].msg);

                   //回调父级的处理事件;
                   if ($scope.listCallback) {
                     $scope.listCallback(results[1]);
                   }

                   // $scope.$apply();
                   if ($attrs.callback) {
                       $scope.$eval($attrs.callback);
                   }

                   $scope.isLoading = false;
               })
               .catch(function(msg) {
                     if(maskObj)maskObj.hide();

                     if ($attrs.errorCallback) {
                         $scope.$eval($attrs.errorCallback);
                     }

                  if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                  if (angular.isDefined($attrs.alertError)) alertError(msg);
                  $('.pr-full-loading').remove();
               });

          }

        }//end link
      };
    }


    /**
        树形
    */
    function zTreeSelect(requestData, alertOk, alertError, proLoading,utils) {
      'use strict';
      return {
        restrict: 'EA',
        scope: {
          "ngModel": "=",
          "idKey": "@?",
          "pIdKey": "@?"
        },
        link: function ($scope, $element, $attrs) {

          var urlKey="zTreeSelect";
          //插下tree div
          var zTreeSelectDivId="zTreeSelectDiv";

          if (angular.isDefined($attrs.zTreeType) && $attrs.zTreeType === 'static') {     // 如果树形zTreeType定义且值为static，则为静态显示树形列表
            // 定义模板
            var tmp_template='<ul id="'+zTreeSelectDivId+'" class="ztree"></ul>';
            // 插入父容器
            $element.append(tmp_template);
            // 初始化树形数据，如果定义的数据是JSON字符串，则进行转换，否则直接赋值
            var data = typeof($attrs.zTreeSelect) === 'string' ? JSON.parse($attrs.zTreeSelect) : $attrs.zTreeSelect;

            zTree_init_static($("#"+zTreeSelectDivId), data, $scope);
          } else {                                                                        // 否则则为事件触发显示树形列表
            var tmp_template='<div id="menuContent" class="menuContent" style="display:none;position:absolute;z-index:11;"><ul id="'+zTreeSelectDivId+'" class="ztree  pg-ztree-select"></ul></div>';
            $element.append(tmp_template);

            $($element).on("click", function() {
              showZTreeSelect($element);
            });

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
              $attrs.$observe(urlKey, function(value) {
                  getData({});
              });
            }
          }

          //组件的显示，隐藏，及触发事件
          function showZTreeSelect($element){
            //  隐藏才会进行数据加载
             var display = $("#menuContent").css('display');
             if(display != 'none'){
               return;
             }
             //加载数据
             getData();
             var cityObj = $element;
             var cityOffset = $element.offset();
             //显示div
             $("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
             $("body").bind("mousedown", onBodyDown);
             $('.z-tree-div').addClass('z-tree-div-active');
          }

          // 获取数据
          function getData(params) {
             //满足条件才异步请求
             if (angular.isDefined($attrs.ajaxIf)) {
               if (!$attrs.ajaxIf) return;
             }
             if (angular.isDefined($attrs.ajaxIfEval)) {
                 var tmp=$scope.$eval($attrs.ajaxIfEval);
               if (!tmp) return;
             }
             $scope.isLoading = true;
             var maskObj=null;
             if (!$attrs.noshowLoading) {
               maskObj=proLoading($element);
               //  if(maskObj)maskObj.hide();
             }
            if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] ="";
             requestData($attrs[urlKey], params)
               .then(function(results) {
                     if(maskObj)maskObj.hide();
                   var data = results[0];
                   console.log(results[0]);
                   zTree_init($("#"+zTreeSelectDivId),data,$scope);

                   if ($attrs.scopeResponse) $scope[$attrs.scopeResponse] = results[1];

                   if (angular.isDefined($attrs.alertOk)) alertOk(results[1].msg);

                   //回调父级的处理事件;
                   if ($scope.listCallback) {
                     $scope.listCallback(results[1]);
                   }

                   // $scope.$apply();
                   if ($attrs.callback) {
                       $scope.$eval($attrs.callback);
                   }

                   $scope.isLoading = false;
               })
               .catch(function(msg) {
                     if(maskObj)maskObj.hide();

                     if ($attrs.errorCallback) {
                         $scope.$eval($attrs.errorCallback);
                     }

                  if ($attrs.scopeErrorMsg) $scope[$attrs.scopeErrorMsg] = (msg);
                  if (angular.isDefined($attrs.alertError)) alertError(msg);
                  $('.pr-full-loading').remove();
               });

          }

          // 初始化数据
          function zTree_init($element,zNodes,$scope){

            var setting = {
                data: {
                  async:{
                      enable:false
                  },
              		simpleData: {
              			enable: true,
              			idKey: $scope.idKey||"id",
              			pIdKey: $scope.pIdKey||"pId",
              			rootPId: null,
              		}
              	},
                callback: {
              		onClick: function(event, treeId, treeNode) {
                      hideMenu();
                      $scope.ngModel=treeNode;
                      $scope.$apply();
                  }
              	}
              };
              require(['ztree'], function(store) {
                  $.fn.zTree.init($element, setting, zNodes);

              });//require
          }

          // 静态显示初始化数据
          function zTree_init_static($element, zNodes, $scope){

            var setting = {
              data: {
                async:{
                    enable:false
                },
            		simpleData: {
            			enable: true,
            			idKey: $scope.idKey||"id",
            			pIdKey: $scope.pIdKey||"pId",
            			rootPId: null,
            		}
            	},
              view: {
                showLine: true,
                showIcon: false,
        				selectedMulti: false,
        				dblClickExpand: false
              },
              callback: {
            		onClick: function(event, treeId, treeNode) {
                  $scope.ngModel = treeNode;
                  $scope.$apply();
                  // console.log($scope);
                  // $scope.handleClickEvent(treeNode);
                  // $scope.$parent.handleClickEvent(treeNode);    // 点击执行父作用域中的重置表单方法
                }
            	}
            };

            require(['ztree'], function(store) {
                $.fn.zTree.init($element, setting, zNodes);
            });
          }


          function addDiyDom(treeId, treeNode) {
      			var spaceWidth = 5;
      			var switchObj = $("#" + treeNode.tId + "_switch"),
      			icoObj = $("#" + treeNode.tId + "_ico");
      			switchObj.remove();
      			icoObj.before(switchObj);

      			if (treeNode.level > 1) {
      				var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
      				switchObj.before(spaceStr);
      			}
      		}

          // 隐藏树形结构
          function hideMenu() {
            $("#menuContent").fadeOut("fast");
            $("body").unbind("mousedown", onBodyDown);
            $('.z-tree-div').removeClass('z-tree-div-active');
          }

          // 点击空白处隐藏树形菜单
          function onBodyDown(event) {
            if (!(event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
              hideMenu();
            }
          }

          $scope.$on("ajaxUrlReload", function() {
             //  getData(_detailsParams);
             getData({});

          });

        }//end link
      };
    }//zTreeSelect

    /**
     *  全局弹出层显示信息组件
     *  支持两种获取信息的模式：
     *    1、从本地读取，getDataType: local
     *    2、从远程服务器拉取  getDataType: fetch
     *  create by liuzhen at 2017/06/23
     */
    function showInfoModal (requestData, utils, alertOk, alertError) {
      'use strict';
      return {
        restrict: 'EA',
        scope: true,
        replace: true,
        templateUrl: function (element, attrs) {
          // return Config.tplPath + scope.templateUrl;
          if (($(document).height() - $(element).offset().top) > 200) {
            return Config.tplPath + attrs.templateUrl + '.html';
          } else {
            return Config.tplPath + attrs.templateUrl + '2.html';
          }
        },
        link: function (scope, element, attrs) {

          var _test = $(document).height() - $(element).offset().top;



          if (_test < 500) {
            console.log(_test);
          }

          // 获取数据拉取模式
          if (attrs.getDataType && attrs.getDataType === 'local') {     // 从已获取的数据对象里获取
            // 弹出层标题
            scope.infoTitle = attrs.infoTitle || '暂无';
            // 详细信息
            scope.infoObject = JSON.parse(attrs.infoObject);
          }


        }
      };
    }


    /**
     * 加入项目
     */
    angular.module('manageApp.main')
      .directive("zTreeSelect", ["requestData", "alertOk", "alertError", "proLoading", "utils", zTreeSelect])
      .directive("zTree", [ "requestData", "alertOk", "alertError", "proLoading","utils", zTree])
      .directive("textInterception", textInterception)
      .directive("ngCompile2", ["$compile",ngCompile2])
      .directive("datepicker", ['$filter',datepicker])
      .directive("watchFormChange", ["watchFormChange", watchFormChange])
      .directive("invalidPopover", ["$route", "$templateCache", "$routeParams", invalidPopover])
      .directive("ngView", ["$route", "$templateCache", "$routeParams", ngView])
      .directive("convertToDate",  ['$filter', convertToDate])
      .directive("convertToNumber", convertToNumber)
      .directive("convertJsonToObject", convertJsonToObject)
      .directive("ajaxUrlSubmit", ["$timeout", "requestData", "alertOk", "alertError", "proLoading","modal","utils", ajaxUrlSubmit])
      .directive("ajaxUrl", ["$timeout", "requestData", "alertOk", "alertError", "proLoading","utils", ajaxUrl])
      .directive("formValidator", ["requestData", "modal", "alertOk", "alertError","dialogConfirm", "$timeout","utils", formValidator])
      .directive("tableList",  ['requestData', 'modal', 'dialogConfirm', '$timeout', 'proLoading','alertError',tableList])
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
      .directive("angucomplete", ["$parse", "requestData", "$sce", "$timeout",angucomplete])
      .directive("checkboxGroup", checkboxGroup)
      .directive("chosen", ["requestData", "$timeout", "$rootScope", "alertError", "proLoading","utils",chosen])
      .directive("pgSelect", ["requestData", "$timeout", "$rootScope", "alertError", "proLoading","utils",pgSelect])
      .directive("formItem", formItem)
      .directive("autoComplete", autoComplete)
      .directive("selectAddress", ["$http", "$q", "$compile",selectAddress])
      .directive("customConfig", customConfig)
      .directive("showInfoModal", ['requestData', 'utils', 'alertOk', 'alertError', showInfoModal])
});
