define('project/controllers-productEnterprise', ['project/init'], function() {
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

        $scope.submitForm = function(fromId) {
                var _url="rest/authen/productEnterprise/save"
                requestData(_url, $scope.formData, 'POST', 'parameterBody')
                    .then(function (results) {
                        if (results[1].code === 200) {
                            alertOk('操作成功');
                        }
                    })
                    .catch(function (error) {
                        if (error) { alertWarn(error); }
                    });


            $('#' + fromId).trigger('submit');
        };




    }

    angular.module('manageApp.project')
        .controller('productEnterpriseController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", productEnterpriseController]);
});
