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
     * 侧边菜单
     */
    function sideNav($scope) {
    };


    /**
     *
     */
    function pageCtrl($scope, modal) {
        modal.closeAll();
    };

    angular.module('manageApp.main')
        .controller('mainCtrl',  ["$scope",mainCtrl])
        .controller('sideNav',  ["$scope",sideNav])
        .controller('pageCtrl',  ["$scope","modal",pageCtrl])
});
