/**
 * Created by hao on 15/11/15.
 */

define('upload/directives', ['upload/init'], function () {

  function uploader() {
        return {
            restrict: 'EA',
            scope: {
                ngModel: "=",
                uploadMax: "@",
                uploadSize: "@",
                width: "@",
                height: "@"
            },
            replace: true,
          templateUrl:  Config.tplPath +'tpl/uploader.html',
            // templateUrl: 'tpl/uploader2.html',
            link: function ($scope, $element, $attrs) {
                var $fileIpt = $('<input type="file" multiple/>');
                var fileType = $attrs.uploadType || "image";
                var initFiles = angular.fromJson($attrs.files || []);
                $scope.fileList = [];
                $scope.delFile = delFile;

                $scope.ngModel = $scope.ngModel || [];
                $scope.uploadMax = $scope.uploadMax || 99;
                $scope.uploadSize = $scope.uploadSize || 10000;
                $scope.width = $scope.width ? $scope.width : 120 + "px";
                $scope.height = $scope.height ? $scope.height : 100 + "px";


                $scope.styleName = $attrs.styleName ||'styleName';

                //获取初始值
                angular.forEach(initFiles, function (_file) {
                    _file.data = angular.copy(_file);
                    _file.status = "finished";
                    if (/\.(jpe?g|png|gif)$/.test(_file.url)) {
                        _file.imgSrc = _file.url;
                    }
                    $scope.fileList.push(_file);
                    $scope.ngModel.push(_file.id);
                });

                //对外提供方法
                $scope.$parent.resetPic = function () {
                    $scope.ngModel = [];
                    $scope.fileList = [];
                };



                $scope.uploadBtn_click= function () {


                    $fileIpt.trigger("click");
                };
//
                var $uploadBtn = $(".uploadBtn", $element);
                $uploadBtn.on("click", function () {


                    $fileIpt.trigger("click");
                });
                $fileIpt.on("change", fileSelected);

                //监听选择文件信息
                function fileSelected() {
                    //HTML5文件API操作
                    var files = $fileIpt[0].files;
                    for (var i = 0, l = files.length; i < l; i++) {

                        if (files[i].size / 1024 > $scope.uploadSize) {
                            alert("文件大小不能超过 " + $scope.uploadSize + " K");
                            return;
                        }
                        switch (fileType) {
                            case "*":
                                var _fileObj = {
                                    status: 'uploading',
                                    file: files[i],
                                    progress: 0,
                                    text: '上传中...',
                                    name: files[i].name,
                                    data: {}
                                };
                                $scope.fileList.push(_fileObj);
                                uploadFile(_fileObj);
                                break;
                            case "image":
                                if (/image/g.test(files[i].type)) {
                                    var _fileObj = {
                                        status: 'uploading',
                                        file: files[i],
                                        progress: 0,
                                        text: '上传中...',
                                        name: files[i].name,
                                        data: {},
                                        imgSrc: window.URL.createObjectURL(new Blob([files[i]], {type: files[i].type}))
                                    };
                                    $scope.fileList.push(_fileObj);
                                    $scope.$digest();
                                    uploadFile(_fileObj);
                                    //console.log($scope.fileList);
                                } else {
                                    alert('只能上传图片');
                                }
                                break;
                            default:
                                if (!files[i].type||new RegExp(fileType).test(files[i].type)) {
                                    var _fileObj = {
                                        status: 'uploading',
                                        file: files[i],
                                        progress: 0,
                                        text: '上传中...',
                                        data: {}
                                    };
                                    $scope.fileList.push(_fileObj);
                                    $scope.$digest();
                                    uploadFile(_fileObj);
                                } else {
                                    alert('上传格式错误');
                                }
                        }
                    }
                }

                //删除图片
                function delFile(file) {



                    var _files = [];
                    var _index = $scope.fileList.indexOf(file);
                    if (_index > -1) {
                        $scope.fileList.splice(_index, 1);
                    }
                    angular.forEach($scope.fileList, function (_file, _key) {
                        _files.push(_file.data.id);
                    });
                    $scope.ngModel = _files;
                }

                //上传文件
                function uploadFile(_fileObj) {
                    var xhr = new XMLHttpRequest();
                    var fd = new FormData();
                    //关联表单数据,可以是自定义参数
                    fd.append("fileData", _fileObj.file);

                    //监听事件
                    xhr.upload.addEventListener("progress", function (evt) {
                        var tmp = Math.round(evt.loaded * 100 / evt.total);
                        if(tmp==100)tmp=99;
                        _fileObj.progress=tmp;
                        //上传进度最多99%，防止id还没返回时，用户就提交后，附件丢失bug。返回id后更新为100%
                        $scope.$digest();
                    }, false);
                    xhr.addEventListener("load", function (evt) {
                        var _data = angular.fromJson(evt.target.responseText);
                        _fileObj.progress = 100;
                        _fileObj.status = "finished";
                        _fileObj.text = '上传成功！';
                        _fileObj.data = _data.data;
                        $scope.ngModel.push(_data.data.id);
                        $scope.$apply();

                        //解决文件上传成功后，删除文件，再上传相同文件失败
                        $fileIpt.val("");

                    }, false);
                    xhr.addEventListener("loadend", function (evt) {
                        if (evt.target.status != 200) {
                            _fileObj.status = "error";
                            _fileObj.text = '上传失败！';
                            $scope.$apply();
                        }
                    });
                    //发送文件和表单自定义参数
                    var _url=$attrs.uploader;
                    if(Config.serverPath){
                      if (_url.indexOf("http://") !==0 && _url.indexOf("https://") !== 0) {
                        _url=Config.serverPath+_url;
                      }
                    }


                    xhr.open("POST", _url);
                    xhr.withCredentials = true;
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.send(fd);
                }
            }
        }
    };



    function uploaderOne(alertError,alertOk,proLoading) {
          return {
              restrict: 'EA',
              scope: {
                  ngModel: "=?",
                  upFile:"=?",
                  params:"=?",
                  responseList:"=?",
                  uploadSize: "@",
                  width: "@",
                  height: "@"
              },

              // templateUrl: 'tpl/uploader2.html',
              link: function ($scope, $element, $attrs) {
                  var $fileIpt = $('<input type="file"/>');
                  //image,*.upload-type="image"
                  var fileType = $attrs.uploadType || "*";

                  $scope.delFile = delFile;

                  $scope.ngModel = $scope.ngModel;
                  $scope.uploadSize = $scope.uploadSize || 10000;
                  $scope.width = $scope.width ? $scope.width : 120 + "px";
                  $scope.height = $scope.height ? $scope.height : 100 + "px";


                  $scope.styleName = $attrs.styleName ||'styleName';


                  //对外提供方法
                  $scope.$parent.resetPic = function () {
                      $scope.ngModel = [];
                  };


                  $element.on("click", function () {
                      $fileIpt.trigger("click");
                  });
                  $fileIpt.on("change", fileSelected);

                  //监听选择文件信息
                  function fileSelected() {
                      //HTML5文件API操作
                      var files = $fileIpt[0].files;
                      for (var i = 0, l = files.length; i < l; i++) {

                          if (files[i].size / 1024 > $scope.uploadSize) {
                              alert("文件大小不能超过 " + $scope.uploadSize + " K");
                              return;
                          }
                          switch (fileType) {
                              case "*":
                                  var _fileObj = {
                                      status: 'uploading',
                                      file: files[i],
                                      progress: 0,
                                      text: '上传中...',
                                      name: files[i].name,
                                      data: ""
                                  };

                                    if($scope.upFile)$scope.upFile=_fileObj;
                                  // $scope.fileList.push(_fileObj);
                                  uploadFile(_fileObj);
                                  break;
                              case "image":
                                  if (/image/g.test(files[i].type)) {
                                    _fileObj = {
                                      status: 'uploading',
                                      file: files[i],
                                      progress: 0,
                                      text: '上传中...',
                                      name: files[i].name,
                                      data: "",
                                      imgSrc: window.URL.createObjectURL(new Blob([files[i]], {type: files[i].type}))
                                    };
                                      // $scope.fileList.push(_fileObj);
                                          if($scope.upFile)$scope.upFile=_fileObj;
                                      $scope.$digest();
                                      uploadFile(_fileObj);
                                      //console.log($scope.fileList);
                                  } else {
                                      alert('只能上传图片');
                                  }
                                  break;
                              default:
                                  if (!files[i].type||new RegExp(fileType).test(files[i].type)) {
                                    _fileObj = {
                                      status: 'uploading',
                                      file: files[i],
                                      progress: 0,
                                      text: '上传中...',
                                      data: {}
                                    };
                                          if($scope.upFile)$scope.upFile=_fileObj;
                                      // $scope.fileList.push(_fileObj);
                                      $scope.$digest();
                                      uploadFile(_fileObj);
                                  } else {
                                      alert('上传格式错误');
                                  }
                          }
                      }
                  }

                  //删除图片
                  function delFile(file) {
                      $scope.ngModel = "";
                  }

                  //上传文件
                  function uploadFile(_fileObj) {
                      var xhr = new XMLHttpRequest();
                      var fd = new FormData();
                      //关联表单数据,可以是自定义参数

                      //添加自定义参数
                      if(  angular.isObject($scope.params)){
                        for (var variable in $scope.params) {
                            fd.append(variable,$scope.params[variable]);
                        }
                      }
                        if($attrs.usege){
                            fd.append("usege", $attrs.usege);
                        }

                      fd.append("fileData", _fileObj.file);



                      var maskObj=null;
                      if (!$attrs.noshowLoading) {
                        maskObj=proLoading($element);
                        //  if(maskObj)maskObj.hide();
                      }

                      //监听事件
                      xhr.upload.addEventListener("progress", function (evt) {
                          var tmp = Math.round(evt.loaded * 100 / evt.total);
                          if(tmp==100)tmp=99;
                          _fileObj.progress=tmp;
                          //上传进度最多99%，防止id还没返回时，用户就提交后，附件丢失bug。返回id后更新为100%
                          $scope.$digest();
                      }, false);
                      xhr.addEventListener("load", function (evt) {
                            if(maskObj)maskObj.hide();
                        //解决文件上传成功后，删除文件，再上传相同文件失败
                       $fileIpt.val("");

                          var _data = angular.fromJson(evt.target.responseText);

                            if (angular.isDefined($attrs.responseList)){
                                if(!$scope.responseList)  $scope.responseList=[];
                                _data._responseTime=new Date().getTime();
                                $scope.responseList.push(_data);
                            }

                            if (!_data || _data.code != 200) {
                                alertError(_data.msg || '出错了');
                                return;
                            }


                            if (angular.isDefined($attrs.alertOk)) alertOk(_data.msg);



                          _fileObj.progress = 100;
                          _fileObj.status = "finished";
                          _fileObj.text = '上传成功！';
                          _fileObj.data = _data.data;
                          // _data.data="http://stimg3.tuicool.com/JNzQre.png";

                          if(angular.isString(_data.data)){
                                $scope.ngModel=_data.data;
                          }else{
                            if(_data.data) 
                                $scope.ngModel=_data.data.key;
                          }

                          if($scope.upFile)$scope.upFile.data=_data.data;


                          $scope.$apply();
                          //callback 放在  $scope.$apply(); 之后，才能及时刷新
                          if ($attrs.callback) {
                              $scope.$parent.$eval($attrs.callback);
                          }
                          $scope.$apply();

                      }, false);
                      xhr.addEventListener("loadend", function (evt) {

                            if(maskObj)maskObj.hide();

                          if (evt.target.status != 200) {
                              _fileObj.status = "error";
                              _fileObj.text = '上传失败！';
                              // $scope.$apply();
                          }
                      });
                      //发送文件和表单自定义参数
                      var _url=$attrs.uploaderOne;
                      if(Config.serverPath){
                        if (_url.indexOf("http://") !==0 && _url.indexOf("https://") !== 0) {
                          _url=Config.serverPath+_url;
                        }
                      }


                      xhr.open("POST", _url);
                      xhr.withCredentials = true;
                      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                      xhr.send(fd);
                  }
              }
          };
      }

//
    angular.module('manageApp.upload')
    .directive("uploaderOne", ["alertError","alertOk","proLoading",uploaderOne])
    .directive("uploader", uploader);
});
