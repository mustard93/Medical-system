/**
 * Created by hao on 16/1/7.
 */
define('project/filters', ['project/init'], function () {


      /** 数字金额大写转换(可以处理整数,小数,负数) */
        function upDigit(){
          return function(n){
            if(!n)return "";
              var fraction = ['角', '分'];
              var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
              var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];
              var head = n < 0? '欠': '';
              n = Math.abs(n);

              var s = '';

              for (var i = 0; i < fraction.length; i++)
              {
                  s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
              }
              s = s || '整';
              n = Math.floor(n);

              for (i = 0; i < unit[0].length && n > 0; i++)
              {
                  var p = '';
                  for (var j = 0; j < unit[1].length && n > 0; j++)
                  {
                      p = digit[n % 10] + unit[1][j] + p;
                      n = Math.floor(n / 10);
                  }
                  s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;
              }
              return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
          };
        }//end upDigit

        /**
         * [repeatFilter 应用于ng-repeat中的过滤器，过滤掉值等于0的项]
         * @return {[type]} [description]
         */
        function repeatFilter () {
          return function (array) {
            var tmp = [];
            angular.forEach(array, function (item, index) {
              // return item.returnQuantity !== 0;
              if (item.returnQuantity !== 0) {
                tmp.push(item);
              }
            });
            return tmp;
          };
        }
        /**
         * [currencyFilter 重写货币过滤器，达到精确度控制]
         * @return {[type]} [description]
         */
        function currencyFilter () {
          return function (money,number) {
            return currency='￥'+money.toFixed(number);
          };
        }

        /**
         * [addSignFilter 在值后添加一个符号的过滤器，目前系统中用于显示%的使用
         * @return {[type]} [description]
         */
        function addSignFilter () {
          return function (text,sign) {
            return value=text+sign;
          };
        }


    angular.module('manageApp.project')
    .filter('upDigit',upDigit)
    .filter('repeatFilter', repeatFilter)
    .filter('currencyFilter', currencyFilter)//currencyFilter 重写货币过滤器，达到精确度控制
    .filter('addSignFilter', addSignFilter);//addSignFilter 在值后添加一个符号的过滤器，目前系统中用于显示%的使用
});
