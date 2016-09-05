/**
 * Created by hao on 15/11/5.
 */

define('project/controllers', ['project/init'], function () {
    //录入成绩
    function importScoreCtrl($scope, requestData, $element, dialogConfirm, modal, $rootScope, $timeout) {
        $scope.formData = {};
        $scope.hasScore = false;
        $scope.canContinue = false;

        $scope.typeStudent = function () {
            $element.find(".studentScoreIpt").focus();
        };

        var _needSaveConfirm = true;
        var _needNotSaveConfirm = true;
        var $selectBanji = $element.find(".selectBanji");
        var $selectKemu = $element.find(".selectKemu");
        var $selectDate = $element.find(".selectDate");
        var _banjiModel = $selectBanji.attr("ng-model").split(".")[1];
        var _kemuModel = $selectKemu.attr("ng-model").split(".")[1];
        var _dateModel = $selectDate.attr("ng-model").split(".")[1];
        var _banjiValue = $selectBanji.val();
        var _kemuValue = $selectKemu.val();
        var _dateValue = $selectDate.val();

        function checkOneStep() {
            $scope.$digest();
            _banjiValue = $selectBanji.val();
            _kemuValue = $selectKemu.val();
            _dateValue = $selectDate.val();

            $scope.canContinue = _banjiValue && _kemuValue && _dateValue;
        };

        //第一步的选择
        $selectBanji.on("change", function (e) {
            var $this = $(this);
            if ($scope.hasScore && $scope.canContinue) {
                var _newValue = $this.val();
                $this.val(_banjiValue);

                var _$scope = $rootScope.$new(false);
                _$scope.confirmText = '你还没有保存当前录入记录,确定要保存?';
                _$scope.confirmBtnTxt = '保存';
                _$scope.cancelBtnTxt = '不保存';
                modal.openConfirm({
                    template: 'tpl/dialog-confirm.html',
                    scope: _$scope
                }).then(function () {
                    $timeout(function () {
                        _needSaveConfirm = false;
                        $element.find(".saveBtn").trigger("click");
                        $scope.formData[_banjiModel] = _newValue;
                        checkOneStep();
                    });
                }).catch(function (_type) {
                    if (_type == 'cancelBtn') {
                        $timeout(function () {
                            _needNotSaveConfirm = false;
                            $element.find(".notSaveBtn").trigger("click");
                            $scope.formData[_banjiModel] = _newValue;
                            checkOneStep();
                        });
                    }
                });
            } else {
                $timeout(checkOneStep);
            }
        });
        $selectKemu.on("change", function (e) {
            var $this = $(this);
            if ($scope.hasScore && $scope.canContinue) {
                var _newValue = $this.val();
                $this.val(_kemuValue);

                var _$scope = $rootScope.$new(false);
                _$scope.confirmText = '你还没有保存当前录入记录,确定要保存?';
                _$scope.confirmBtnTxt = '保存';
                _$scope.cancelBtnTxt = '不保存';
                modal.openConfirm({
                    template: 'tpl/dialog-confirm.html',
                    scope: _$scope
                }).then(function () {
                    $timeout(function () {
                        _needSaveConfirm = false;
                        $element.find(".saveBtn").trigger("click");
                        $scope.formData[_kemuModel] = _newValue;
                        checkOneStep();
                    });
                }).catch(function (_type) {
                    if (_type == 'cancelBtn') {
                        $timeout(function () {
                            _needNotSaveConfirm = false;
                            $element.find(".notSaveBtn").trigger("click");
                            $scope.formData[_kemuModel] = _newValue;
                            checkOneStep();
                        });
                    }
                });
            } else {
                $timeout(checkOneStep);
            }
        });
        $selectDate.on("change", function (e) {
            var $this = $(this);
            if ($scope.hasScore && $scope.canContinue) {
                var _newValue = $this.val();
                $this.val(_dateValue);

                var _$scope = $rootScope.$new(false);
                _$scope.confirmText = '你还没有保存当前录入记录,确定要保存?';
                _$scope.confirmBtnTxt = '保存';
                _$scope.cancelBtnTxt = '不保存';
                modal.openConfirm({
                    template: 'tpl/dialog-confirm.html',
                    scope: _$scope
                }).then(function () {
                    $timeout(function () {
                        _needSaveConfirm = false;
                        $element.find(".saveBtn").trigger("click");
                        $scope.formData[_dateModel] = _newValue;
                        checkOneStep();
                    });
                }).catch(function (_type) {
                    if (_type == 'cancelBtn') {
                        $timeout(function () {
                            _needNotSaveConfirm = false;
                            $element.find(".notSaveBtn").trigger("click");
                            $scope.formData[_dateModel] = _newValue;
                            checkOneStep();
                        });
                    }
                });
            } else {
                $timeout(checkOneStep);
            }
        });

        /** 原typeScore方法，下面进行改写 at 2016/06/23
        $scope.typeScore = function ($e, _url, _data) {
            if ($e.keyCode == 13) {
                requestData(_url, _data)
                    .then(function () {
                        //刷新数据
                        $scope.formData.time = Date.now();

                        var $ipt = $element.find(".studentNameIpt input");
                        $ipt.val("").focus();
                        $element.find(".studentScoreIpt").val("");
                    })
                    .catch(function (error) {
                        alert(error || '录入成绩错误');
                    });
            }
        };
        */


        /**
         *  成绩录入页面：/class/toInputClassScore
         *  修改bug，在用户第二次输入时，提示需要输入考生姓名
         *  Modifid:　2016/06/23 by LiuZhen
         */
        $scope.typeScore = function ($e, _url, _data) {
            if ($e.keyCode == 13) {
              // 获取修改页面对象
              var $ipt = $element.find(".studentNameIpt input");
              // 判断对象内容是否为空
              if (!$ipt.val()) {
                alert('请输入考生姓名！'); $ipt.focus(); return;
              }

            requestData(_url, _data)
                .then(function () {
                    //刷新数据
                    $scope.formData.time = Date.now();
                    $ipt.val("").focus();
                    $element.find(".studentScoreIpt").val("");
                })
                .catch(function (error) {
                    alert(error || '录入成绩错误');
                });
            }
        };

        //保存录入的成绩
        $scope.saveScore = function (_text, _callback) {
            if (_needSaveConfirm) {
                dialogConfirm(_text, function () {
                    requestData($scope.saveScoreUrl, $scope.formData)
                        .then(function (data) {
                            var _data = data[0];
                            if (_data.url) {
                                window.location.assign(_data.url);
                            }
                            $scope.hasScore = false;
                            $scope.formData.time = Date.now();
                            if (_callback) {
                                _callback();
                            } else if (angular.isFunction($scope.submitCallBack)) {
                                $scope.submitCallBack.call($scope);
                            }
                            modal.closeAll();
                        })
                        .catch(function (error) {
                            alert(error || '保存错误');
                        })
                });
            } else {
                requestData($scope.saveScoreUrl, $scope.formData)
                    .then(function () {
                        _needSaveConfirm = true;
                        $scope.hasScore = false;
                        $scope.formData.time = Date.now();
                        if (_callback) {
                            _callback();
                        } else if (angular.isFunction($scope.submitCallBack)) {
                            $scope.submitCallBack.call($scope);
                        }
                    })
                    .catch(function (error) {
                        _needSaveConfirm = true;
                        alert(error || '保存错误');
                    })
            }
        };

        //不保存录入的成绩
        $scope.notSaveScore = function (_text, _callback) {
            if (_needNotSaveConfirm) {
                dialogConfirm(_text, function () {
                    requestData($scope.notSaveScoreUrl, $scope.formData)
                        .then(function () {
                            $scope.hasScore = false;
                            $scope.formData.time = Date.now();
                            if (_callback) {
                                _callback();
                            } else if (angular.isFunction($scope.submitCallBack)) {
                                $scope.submitCallBack.call($scope);
                            }
                            modal.closeAll();
                        })
                        .catch(function (error) {
                        })
                });
            } else {
                requestData($scope.notSaveScoreUrl, $scope.formData)
                    .then(function () {
                        _needNotSaveConfirm = true;
                        $scope.hasScore = false;
                        $scope.formData.time = Date.now();
                        if (_callback) {
                            _callback();
                        } else if (angular.isFunction($scope.submitCallBack)) {
                            $scope.submitCallBack.call($scope);
                        }
                    })
                    .catch(function (error) {
                        _needNotSaveConfirm = true;
                    })
            }
        };

        //列表处理事件: 是否录入成绩
        $scope.listCallback = function (_data) {
            $scope.hasScore = _data.hasScore;
        };

        //退出事件
        var $exitImportScore = $(".exitImportScore").on("click", function (e) {
            if ($scope.hasScore && $scope.canContinue) {
                e.preventDefault();
                e.stopPropagation();
                var _$scope = $rootScope.$new(false);
                _$scope.confirmText = '你还没有保存当前录入记录,确定要保存?';
                _$scope.confirmBtnTxt = '保存';
                _$scope.cancelBtnTxt = '不保存';
                modal.openConfirm({
                    template: 'tpl/dialog-confirm.html',
                    scope: _$scope
                }).then(function () {
                    $timeout(function () {
                        _needSaveConfirm = false;
                        $scope.saveScore("", function () {
                            $exitImportScore.trigger("click");
                        })
                    });
                }).catch(function (_type) {
                    if (_type == 'cancelBtn') {
                        $timeout(function () {
                            _needNotSaveConfirm = false;
                            $scope.notSaveScore("", function () {
                                $exitImportScore.trigger("click");
                            })
                        });
                    }
                });
            }
        });
    };
    importScoreCtrl.$inject = ['$scope', 'requestData', '$element', 'dialogConfirm', 'modal', '$rootScope', '$timeout'];

    //发送通知
    function noticePageCtrl($scope, $element, $timeout) {
        var $select = $element.find(".selectRecipient");
        $timeout(function () {
            $scope.formData = angular.extend($scope.$parent.formData, $scope.formData);
            $scope.formData.recipient = [];
            $scope.selectOne = function (_data) {
                var _index = $scope.formData.recipient.indexOf(_data.id);
                if (_index > -1) {
                    $scope.formData.recipient.splice(_index, 1);
                } else {
                    $scope.formData.recipient.push(_data.id);
                }
                $timeout(function () {
                    $select.trigger("chosen:updated");
                });
            };


            $scope.selectMultiple = function (trees, e) {
                var $e = $(e.currentTarget);
                var isSelected = $e.data("selected");
                angular.forEach(trees, function (_node) {
                    var _index = $scope.formData.recipient.indexOf(_node.id);
                    if (isSelected) {
                        if (_index > -1) {
                            $scope.formData.recipient.splice(_index, 1);
                        }
                    } else {
                        if (_index == -1) {
                            $scope.formData.recipient.push(_node.id);
                        }
                    }
                });
                if (!isSelected) {
                    $e.data("selected", true);
                    $e.text('取消全选');
                } else {
                    $e.data("selected", false);
                    $e.text('全选');
                }

                $timeout(function () {
                    $select.trigger("chosen:updated");
                });
            };
        });
    };
    noticePageCtrl.$inject = ['$scope', '$element', '$timeout'];

    //
    function noticeSubmitCtrl($scope) {
        $scope.submitCallBack = function (_data1, _data2) {
            if (_data2) {
                alert("提交成功");
                if (_data2.url) {
                    window.location.assign(_data2.url);
                } else {
                    window.location.reload();
                }
            } else {
                alert("提交失败");
            }
        }
    };
    noticeSubmitCtrl.$inject = ['$scope'];

    angular.module('manageApp.project')
        .controller('importScoreCtrl', importScoreCtrl)
        .controller('noticePageCtrl', noticePageCtrl)
        .controller('noticeSubmitCtrl', noticeSubmitCtrl)
});
