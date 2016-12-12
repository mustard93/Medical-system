define(['project/angucomplete'], function(){
　　  /**
        自动补全
      */
      function Angucomplete($scope,elem,$parse, requestData, $sce, $timeout,ngModel){

        var isNewSearchNeeded = function(newTerm, oldTerm) {
            return newTerm.length >= $scope.minLength && newTerm != oldTerm
        };
        //解析返回数据
        var processResults = function(responseData, str) {
            if (responseData && responseData.length > 0) {
                $scope.results = [];

                var titleFields = [];
                if ($scope.titleField && $scope.titleField != "") {
                    titleFields = $scope.titleField.split(",");
                }

                for (var i = 0; i < responseData.length; i++) {
                    // Get title variables
                    var titleCode = [];

                    for (var t = 0; t < titleFields.length; t++) {
                        titleCode.push(responseData[i][titleFields[t]]);
                    }

                    var description = "";
                    if ($scope.descriptionField) {
                        description = responseData[i][$scope.descriptionField];
                    }

                    var text = titleCode.join(' ');
                    if ($scope.matchClass) {
                        var re = new RegExp(str, 'i');
                        var strPart = text.match(re)[0];
                        text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
                    }

                    var resultRow = {
                        id: responseData[i].id,
                        title: text,
                        description: description,
                        //image: image,
                        data: responseData[i]
                    };

                    $scope.results[$scope.results.length] = resultRow;
                }


            } else {
                $scope.results = [];
            }
        };//processResults


        //根据输入参数查询数据
        var searchTimerComplete = function(str) {
            // Begin the search

            if (str.length >= $scope.minLength) {
                if ($scope.localData) {
                    var searchFields = $scope.searchFields.split(",");

                    var matches = [];

                    for (var i = 0; i < $scope.localData.length; i++) {
                        var match = false;

                        for (var s = 0; s < searchFields.length; s++) {
                            match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                        }

                        if (match) {
                            matches[matches.length] = $scope.localData[i];
                        }
                    }

                    $scope.searching = false;
                    processResults(matches, str);

                } else {
                    requestData($scope.url, {
                            q: str
                        })
                        .then(function(results) {
                            var data = results[0];
                            $scope.searching = false;
                            processResults(data, str);
                        })
                        .catch(function(error) {
                            $scope.searching = false;
                            console.error(error);
                        });
                }
            }
        };//searchTimerComplete

        //隐藏下拉框
        var hideResults = function() {
            $scope.hideTimer = $timeout(function() {
                $scope.showDropdown = false;
            }, $scope.pause);
        };
        // 取消  隐藏下拉框
        var resetHideResults = function() {
            if ($scope.hideTimer) {
                $timeout.cancel($scope.hideTimer);
            }
        };
        //记录选中节点
        var hoverRow = function(index) {
            $scope.currentIndex = index;
        };

        //按下事件.
        var keyPressed = function(event) {
            if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                if (!$scope.searchStr || $scope.searchStr == "") {
                    $scope.showDropdown = false;
                    $scope.lastSearchTerm = null
                } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                    $scope.lastSearchTerm = $scope.searchStr;
                    $scope.showDropdown = true;
                    $scope.currentIndex = -1;
                    $scope.results = [];

                    if ($scope.searchTimer) {
                        $timeout.cancel($scope.searchTimer);
                    }

                    $scope.searching = true;

                    $scope.searchTimer = $timeout(function() {
                      searchTimerComplete($scope.searchStr);
                    }, $scope.pause);
                }
            } else {
                event.preventDefault();
            }
        };//keyPressed

        //选择节点后,
         var selectResult = function(result) {
            if ($scope.matchClass) {
                result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
            }
            $scope.searchStr = $scope.lastSearchTerm = result.title;
            $scope.selectedItem = result;
            $scope.showDropdown = false;
            $scope.results = [];
            ngModel && ngModel.$setViewValue(result);
        };

        //div 元素 键盘事件.
        var elemKeyup=function(event) {
            if (event.which === 40) {
                if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                    $scope.currentIndex++;
                    $scope.$apply();
                    event.preventDefault;
                    event.stopPropagation();
                }

                $scope.$apply();
            } else if (event.which == 38) {
                if ($scope.currentIndex >= 1) {
                    $scope.currentIndex--;
                    $scope.$apply();
                    event.preventDefault;
                    event.stopPropagation();
                }

            } else if (event.which == 13) {
                if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                  selectResult($scope.results[$scope.currentIndex]);
                    $scope.$apply();
                    event.preventDefault;
                    event.stopPropagation();
                } else {
                    $scope.results = [];
                    $scope.$apply();
                    event.preventDefault;
                    event.stopPropagation();
                }

            } else if (event.which == 27) {
                $scope.results = [];
                $scope.showDropdown = false;
                $scope.$apply();
            } else if (event.which == 8) {
                $scope.selectedItem = null;
                $scope.$apply();
            }
        };//


        var inputField = elem.find('input');

        inputField.on('keyup', keyPressed);

        elem.on("keyup", elemKeyup);//  elem.on("keyup",

        this.$scope=$scope;
        this.processResults=processResults;
        this.searchTimerComplete=searchTimerComplete;
        this.hoverRow=hoverRow;
        this.hideResults=hideResults;
        this.resetHideResults=resetHideResults;
        this.keyPressed=keyPressed;
          this.selectResult=selectResult;
        return this;
      };//Angucomplete


　　　　return Angucomplete;
});
