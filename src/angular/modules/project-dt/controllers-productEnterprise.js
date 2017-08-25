define('project-dt/controllers-productEnterprise', ['project-dt/init'], function() {
    /**
     * [productEnterpriseController 生產企業管理]
     * @method productEnterpriseController
     * @param  {[type]}                   $scope          [description]
     * @param  {[type]}                   modal           [description]
     * @param  {[type]}                   alertWarn       [description]
     * @param  {[type]}                   alertError      [description]
     * @param  {[type]}                   requestData     [description]
     * @param  {[type]}                   utls            [description]
     * @return {[type]}                                   [description]
     */
    function productEnterpriseController ($scope, modal, alertWarn, alertError, requestData, utils) {
    }

    angular.module('manageApp.project-dt')
    .controller('productEnterpriseController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", productEnterpriseController]);
});
