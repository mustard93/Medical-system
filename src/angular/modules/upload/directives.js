<<<<<<< HEAD
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
            templateUrl: Config.tplPath+'tpl/uploader.html',
            link: function ($scope, $element, $attrs) {
                var $fileIpt = $('<input type="file" multiple/>');
                var fileType = $attrs.uploadType || "image";
                var initFiles = angular.fromJson($attrs.files || []);
                $scope.fileList = [];
                $scope.delFile = delFile;
                $scope.ngModel = $scope.ngModel || [];
                $scope.uploadMax = $scope.uploadMax || 99;
                $scope.uploadSize = $scope.uploadSize || 1000;
                $scope.width = $scope.width ? $scope.width : 120 + "px";
                $scope.height = $scope.height ? $scope.height : 100 + "px";

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

                var $uploadBtn = $(".uploadBtn", $element)
                $uploadBtn.on("click", function () {
                    $fileIpt.trigger("click");
                });
                $fileIpt.on("change", fileSelected);

                //监听选择文件信息
                function fileSelected() {
                    //HTML5文件API操作
                    var files = $fileIpt[0].files;
                    for (var i = 0, l = files.length; i < l; i++) {
                        if ($scope.fileList.length >= $scope.uploadMax) {
                            alert("超过文件上传数");
                            return;
                        }
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
                                $scope.$digest();
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
                                } else {
                                    alert('只能上传图片');
                                }
                                break;
                            default:
                                if (new RegExp(fileType).test(files[i].type)) {
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
                        _fileObj.progress = Math.round(evt.loaded * 100 / evt.total);
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
                    }, false);
                    xhr.addEventListener("loadend", function (evt) {
                        if (evt.target.status != 200) {
                            _fileObj.status = "error";
                            _fileObj.text = '上传失败！';
                            $scope.$apply();
                        }
                    });
                    //发送文件和表单自定义参数
                    xhr.open("POST", $attrs.uploader);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.send(fd);
                }
            }
        }
    };

    uploader.$inject = [];

//
    angular.module('manageApp.upload')
        .directive("uploader", uploader)
=======
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
            templateUrl: Config.tplPath+'tpl/uploader.html',
            link: function ($scope, $element, $attrs) {
                var $fileIpt = $('<input type="file" multiple/>');
                var fileType = $attrs.uploadType || "image";
                var initFiles = angular.fromJson($attrs.files || []);
                $scope.fileList = [];
                $scope.delFile = delFile;
                $scope.ngModel = $scope.ngModel || [];
                $scope.uploadMax = $scope.uploadMax || 99;
                $scope.uploadSize = $scope.uploadSize || 1000;
                $scope.width = $scope.width ? $scope.width : 120 + "px";
                $scope.height = $scope.height ? $scope.height : 100 + "px";

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

                var $uploadBtn = $(".uploadBtn", $element)
                $uploadBtn.on("click", function () {
                    $fileIpt.trigger("click");
                });
                $fileIpt.on("change", fileSelected);

                //监听选择文件信息
                function fileSelected() {
                    //HTML5文件API操作
                    var files = $fileIpt[0].files;
                    for (var i = 0, l = files.length; i < l; i++) {
                        if ($scope.fileList.length >= $scope.uploadMax) {
                            alert("超过文件上传数");
                            return;
                        }
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
                                $scope.$digest();
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
                                } else {
                                    alert('只能上传图片');
                                }
                                break;
                            default:
                                if (new RegExp(fileType).test(files[i].type)) {
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
                        _fileObj.progress = Math.round(evt.loaded * 100 / evt.total);
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
                    }, false);
                    xhr.addEventListener("loadend", function (evt) {
                        if (evt.target.status != 200) {
                            _fileObj.status = "error";
                            _fileObj.text = '上传失败！';
                            $scope.$apply();
                        }
                    });
                    //发送文件和表单自定义参数
                    xhr.open("POST", $attrs.uploader);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.send(fd);
                }
            }
        }
    };

    uploader.$inject = [];

//
    angular.module('manageApp.upload')
        .directive("uploader", uploader)
>>>>>>> 131c094fb42f0ae521b089da93162818f5b2c4ef
});