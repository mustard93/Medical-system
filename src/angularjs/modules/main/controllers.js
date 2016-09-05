/**
 * Created by hao on 15/11/5.
 */

define('main/controllers', ['main/init'], function () {

    /**
     * 主控
     */
    function mainCtrl($scope) {
        $scope.mainStatus = {
            navFold: document.body.clientWidth < 1500,
            navigation: "",
            msgBubble: 0 //消息气泡
        };
        $scope.mainConfig = window.Config || {};
        //页面跳转
        $scope.pageTo = function (_url) {
            window.location.assign(_url);
        };

        //获取主要信息
        if ($scope.mainConfig.getMainInfo) {
            $.getJSON($scope.mainConfig.getMainInfo, function (_data) {
                    if (_data.code == 200) {
                        angular.extend($scope.mainStatus, _data.data);
                    }
                })
                .complete(function () {
                    $scope.$digest();
                });
        }

        //后退
        $(document).on("click", ".top-nav-wrap .backBtn", function () {
            window.history.back();
        })
    };

    /**
     * 一个空控制器
     */
    function oneCtrl() {

    }

    /**
     * 侧边菜单
     */
    function sideNav($scope) {
    };
    sideNav.$inject = ["$scope"];

    /**
     *
     */
    function pageCtrl($scope, modal) {
        modal.closeAll();
    };
    pageCtrl.$inject = ["$scope", "modal"];

    angular.module('manageApp.main')
        .controller('mainCtrl',  ["$scope",mainCtrl])
        .controller('oneCtrl',  ["$scope",oneCtrl])
        .controller('sideNav',  ["$scope",sideNav])
        .controller('pageCtrl',  ["$scope",pageCtrl])
});
