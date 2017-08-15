/**
 * Created by hao on 16/1/7.
 */
define('main/filters', ['main/init'], function () {
  /**
    	 *
    	* @Description: 输出html格式：angluar 安全考虑限制了html输出。该方法解除安全限制，
    	* @method to_trusted
    	* @param text html格式
    	* @return 输出html格式
    	* @author liumingquan
    	* @date 2017年2月8日
    	 */
  var to_trusted= ['$sce', function ($sce) {
　　return function (text) {
    　　return $sce.trustAsHtml(text);
　　};
}];
/**
  	 *
  	* @Description: 对象转换成格式化后json字符串
  	* @method jsonFormat
  	* @param obj 对象
  	* @return 格式化后json字符串
  	* @author liumingquan
  	* @date 2017年2月8日
  	 */
var jsonFormat= ['utils', function (utils) {
    return function (obj) {
        var jsonString=null;
          if(!obj)return jsonString;
            try{
              jsonString=JSON.stringify( obj, null, "\t");
            }catch(e){
                  jsonString=utils.toJson(obj);
            }
            return jsonString;
  　　};
}];


angular.module('manageApp.main')
.filter('jsonFormat',jsonFormat)
.filter('to_trusted',to_trusted);
});
