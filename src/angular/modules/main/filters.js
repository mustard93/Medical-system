/**
 * Created by hao on 16/1/7.
 */
define('main/filters', ['main/init'], function () {

  var to_trusted= ['$sce', function ($sce) {
　　return function (text) {
    　　return $sce.trustAsHtml(text);
　　};
}];

angular.module('manageApp.main')
.filter('to_trusted',to_trusted);
});
