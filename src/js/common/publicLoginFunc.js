/**
 *  项目全局的用户登录处理构造函数类
 *  @param formId 当前form表单id
 *  @param userId 用户名input的Id
 *  @param pwdId  密码input的Id
 *  @param remeberId  选择保存用户名input的Id
 *  @param errMsgClass  显示错误信息的DOM元素类
 *  @param conf  系统配置对象
 *  @param requestUrl 登录请求地址
 *  @param clientUrl 客户端信息保存地址
 *  @return null
 *  create by Liuzhen on 2017/06/13
 */

function Login (formId, userId, pwdId, remeberId, errMsgClass, conf, requestUrl, clientUrl) {
  // 判断是否已加载jQuery
  if (!window.$) { throw new Error('jQuery is not Loading...'); }

  this.form = $('#' + formId) || $('#loginForm');
  this.userId = userId;
  this.pwdId = pwdId;
  this.remeberId = remeberId || 'remeberNumber';
  this.errMsgClass = errMsgClass || '.login-info-prompt';
  this.conf = conf;
  this.requestUrl = requestUrl || 'rest/index/authorize.json';
  this.clientUrl = clientUrl || 'rest/loginRecords/add';
}

// 定义Login类中的各种需要共享的属性和方法
Login.prototype = {
  // 初始化父类原型指针
  constructor: Login,

  // 这里定义各种需要共享的相同属性

  // 这里定义共享方法
  // 初始化
  init: function () {
    return {
      form: this.form,
      userId: this.userId,
      pwdId: this.pwdId,
      remeberId: this.remeberId,
      errMsgClass: this.errMsgClass,
      conf: this.conf,
      requestUrl: this.requestUrl,
      clientUrl: this.clientUrl,

      // 存储登录信息
      _saveLoginInfo: function (data) {
        if ($('#' + this.remeberId).is(':checked') && window.localStorage) {
          window.localStorage.setItem('manage_remeberNumber', data);
        } else {
          window.localStorage.setItem('manage_remeberNumber', '');
        }
      },

      // 获取客户端浏览器信息
      _getBrowserInfo: function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var re =/(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        var m = ua.match(re);
        Sys.browser = m[1].replace(/version/, "'safari");
        Sys.ver = m[2];
        return Sys;
      },

      _getOsInfo: function () {
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
        if (isLinux) {
          if(bIsAndroid) return "Android";
          else return "Linux";
        }
        if (isWin) {
          if (sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1) { return "Win2000"; }
          if (sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1) { return "WinXP"; }
          if (sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1) { return "Win2003"; }
          if (sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1) { return "WinVista"; }
          if (sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1) { return "Win7"; }
          if (sUserAgent.indexOf("windows nt6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1) { return "Win8"; }
          if (sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1) { return "Win10"; }
        }
        return "其他";
      },

      // 获取客户端信息
      _getClientInfo: function (results) {
        return {
          "userId": results.data.id,          // 用户id
          "appName": this.conf.serverPath.split('/')[this.conf.serverPath.split('/').length-2],                      // 应用名
          "appVersion": this.conf.ver,                                    // 应用版本号
          "appApiVersion": '',                                            // 服务器接口版本号
          "clientType": 'pc',                                             // 客户端类型
          "clientSystem": this._getBrowserInfo().browser,                 // 客户端系统版本或浏览器名称
          "clientSystemVersion": this._getBrowserInfo().ver,              // 客户端系统版本或浏览器名称（版本号）
          "system": this._getOsInfo(),                                    // 操作系统
          "systemVersion": '',                                            // 操作系统版本号
          "type": '',                                                     // 机型
          "channel": ''                                                   // 渠道
        };
      },

      // 发送客户端信息
      _sendClientInfo: function (_data) {
        var _url = this.conf.serverPath + this.clientUrl;
        $.ajax({
          url: _url,
          type: 'POST',
          data: JSON.stringify(_data),
          contentType: 'application/json',
          crossDomain: true,
          dataType: 'json',
          success: function (results) {
            if (results.code === 200) { return true; }
          }
        });
      },

      // 发送登录请求成功后的回调方法
      _successCallback: function (results) {
        if (results.code === 200) {
          this._saveLoginInfo($('#' + this.userId).val());   // 保存用户名
          this._sendClientInfo(this._getClientInfo(results));
          window.location.href = "index.html";
        } else {
          var _d = this.errMsgClass + ' > div > span';
          $(_d).text(results.msg);
          $(this.errMsgClass).fadeIn(500);
        }
      },

      // 发送登录请求失败后的回调方法
      _errorCallback: function (error) {
        alert("服务器连接不上或内部异常：" + error.responseText);
      }
    };
  },

  // 绑定登录请求
  bindSubmitEvent: function () {
    // 判断是否已加载jQuery
    if (!window.$) { throw new Error('jQuery is not Loading...'); }

    // 判断请求URl是否定义
    if (!this.requestUrl) { throw new Error('Request URL is not Defined!'); }

    // 调用初始化
    var params = this.init();

    // 为按钮绑定事件
    $(this.form).on('submit', function () {
      var _u = 'input[id="' + params.userId + '"]',
          _p = 'input[id="' + params.pwdId + '"]';

      // 构建数据对象
      var _paramsObj = {
        phone: $(this).find(_u).val(),
        password: $(this).find(_p).val()
      };

      // 发送请求
      $.ajax({
        url: params.conf.serverPath + params.requestUrl,
        type: 'POST',
        data: _paramsObj,
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        dataType: 'json',
        success: function (results) {
          params._successCallback(results);
        },
        error: function (err) {
          params._errorCallback(err);
        }
      });
    });
  },

  // 获取版本号
  // @return: 请求后返回的数据体：data
  getVersionNo: function (type, url, dataType) {
    var _type = type ? type : 'GET';
    var _reqUrl = url;
    var _dataType = dataType ? dataType : 'JSON';

    var _versionNo = '';

    try {
      $.ajax({
        type: _type,
        url: _reqUrl,
        dataType: _dataType,
        async: false,
        success: function (result) {
          if (result.code === 200) {
            _versionNo = result.data.model.version;
          } else {
            throw new TypeError('版本数据请求失败!');
          }
        }
      });

    }
    catch (e) {
      throw new Error(e);
    }

    return _versionNo;
  }
};
