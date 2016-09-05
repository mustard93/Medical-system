/**
 * Created by hao on 15/11/5.
 */

define('project/directives', ['moment', 'project/init'], function (moment) {
    //日历系统
    function tableCalendar(requestData) {
        return {
            link: function ($scope, $element, $attrs) {
                $scope.statusList = {};
                $scope.dateSelect = function (_date) {
                    window.location.assign($attrs.selectTo + _date.format("YYYY-MM-DD"));
                };
                $scope.changeMonth = function (_date) {
                    var _month = _date.format("YYYY-MM");
                    requestData($attrs.tableCalendar, {month: _month})
                        .then(function (_data) {
                            $scope.statusList = _data[0];
                        })
                };
                $scope.changeMonth(moment());
            }
        }
    };
    tableCalendar.$inject = ["requestData"];

    //日历提示
    function datePopover($timeout) {
        return {
            restrict: 'AE',
            scope: {
                datePopover: "=?"
            },
            link: function ($scope, $element) {
                $timeout(function () {
                    if ($scope.datePopover) {
                        $element.addClass($scope.datePopover.css);
                        $element.on("mouseenter", function () {
                            $(".popover").remove();
                            var $popover = $('<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>');
                            $popover.css({
                                top: $element.offset().top + 5,
                                left: $element.offset().left
                            });

                            var _list = "<ul>";
                            $.each($scope.datePopover.eventList, function (i, _event) {
                                if (i < 3) {
                                    _list += '<li>' + _event + '</li>';
                                } else if (i == 3) {
                                    _list += '<li>……</li>';
                                }
                            });
                            _list += '</ul>';

                            $(".popover-content", $popover).html(_list);
                            $popover.appendTo("body");
                        });
                        $element.on("mouseleave", function () {
                            $(".popover").remove();
                        });
                        $element.on("click", function () {
                            $(".popover").remove();
                        })
                    }
                })
            }
        }
    };
    datePopover.$inject = ["$timeout"];

    /**
     * 打分
     */
    function scoreConfig() {
        return {
            restrict: 'AE',
            scope: {
                teacherList: "=",
                selectCount: "=?"
            },
            require: "?^ngModel",
            transclude: true,
            link: function ($scope, $element, $attrs, ngModel, $transclude) {
                $scope.$watch("teacherList", function (value) {
                    if (value) {
                        var _count = 0;
                        angular.forEach(value, function (v, k) {
                            if (v.ruleIdList.length) {
                                _count++;
                            }
                        });
                        ngModel.$setViewValue(_count);
                    }
                }, true);

                $transclude($scope, function (clone) {
                    $element.append(clone);
                });
            }
        };
    };

    /**
     * 点击修改
     */
    function clickEdit(requestData, $timeout) {
        return {
            restrict: 'AE',
            scope: {
                requestUrl: "@",
                clickEdit: "=",
                status: "="
            },
            transclude: true,
            template: '<div><span ng-show="!isEdit">' +
            '<span ng-if="text===\'\'||text==undefined" class="color-red">未录入</span>' +
            '<span ng-if="text>=0">{{text}}</span>' +
            '</span>' +
            '<span ng-show="isEdit"><input type="text" class="ipt ipt-s ipt-xshort" ng-model="text" ng-keyup="finishInput($event)" ng-blur="cancelEdit()" /></span></div>',
            link: function ($scope, $element, $attrs) {
                $scope.text = $scope.clickEdit;

                $element.on("click", function (e) {
                    if (!$scope.status) {
                        return;
                    }
                    $scope.isEdit = true;
                    $scope.$digest();
                    $element.find("input").focus().select();
                });

                var oldScore = "";

                $scope.cancelEdit = function () {
                    $scope.isEdit = false;

                    var score = $scope.text = $.trim($scope.text);
                    if (score) {
                        if (oldScore == score) {
                            return;
                        }
                        oldScore = $scope.clickEdit = $scope.text = parseFloat(score) || 0;
                        requestData($scope.requestUrl, {score: oldScore})
                            .then(function (_data) {
                                $scope.$parent.$parent.$parent.hasScore = _data[1].hasScore;
                                checkStudentScore();
                            });
                    }
                };
                $scope.finishInput = function ($e) {
                    if ($e.keyCode == 13) {
                        $scope.isEdit = false;
                    }
                };

                function checkStudentScore() {
                    var studentListDetails = $scope.$parent.$parent.details;
                    var _num1 = 0;
                    var _num2 = 0;
                    angular.forEach(studentListDetails.list, function (one) {
                        if (one.score >= 0) {
                            _num2++;
                        } else {
                            _num1++;
                        }
                    });
                    studentListDetails.noScoreNum = _num1;
                    studentListDetails.hasScoreNum = _num2;
                }
            }
        }
    };
    clickEdit.$inject = ["requestData", "$timeout"];

    angular.module('manageApp.project')
        .directive('tableCalendar', tableCalendar)
        .directive('datePopover', datePopover)
        .directive('scoreConfig', scoreConfig)
        .directive('clickEdit', clickEdit)
});