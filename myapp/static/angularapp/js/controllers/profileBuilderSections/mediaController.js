// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

// mySocialElite.run('$anchorScroll', function($anchorScroll) {
//     $anchorScroll.yOffset = -150;   // always scroll by 50 extra pixels
// });

mySocialElite.directive('ngReallyClickMedia', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClickMedia);
                }
            });
        }
    }
}]);


mySocialElite.config(function ($provide, $compileProvider) {
  $provide.constant('$compileProvider', $compileProvider);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:video|data:image|data:application\//);
});

mySocialElite.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

mySocialElite.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});


mySocialElite.directive('pasteVideoLink', function(){
    var linkFn = function(scope, element, attrs) {

        element.on('paste', function() {
            setTimeout(function() {
                /*console.log(element.val());*/
                scope.uploadVideoLink = element.val();
                scope.srcStatus.video = true;    
                scope.$apply();
                
            }, 5);

        });
    };

    return {
        restrict: 'A',
        link: linkFn
    };
});

mySocialElite.service('fileUpload', ['$http', '$rootScope', function ($http, $rootScope) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            /*console.log("Successfully Saved")*/
            $rootScope.$broadcast('eventFired', {
                data: 'something'
            });
        })
        .error(function(){
        });
    }

    this.uploadLinkToUrl = function(videoLink, uploadUrl){
        $http({
            url:'/linkUpload',
            method: 'POST',
            data: {"videoLink":videoLink},
        }).success(function(response){
            /*console.log("Successfully Saved");*/
            $rootScope.$broadcast('eventFired', {
                data: 'something'
            });
        });
    }

}]);

mySocialElite.controller('mediaController', ['$scope', '$http', 'fileUpload', 'myservice', '$document', 
    function($scope, $http, fileUpload, myservice, $document){

    $scope.jumpTo = function(id) {
        var element = angular.element(document.getElementById(id));
        $document.scrollTo(element,60,1000);
    }

    $scope.uploadPreview = '';
    $scope.reader;
    $scope.srcStatus = { 'image': false, 'document': false, 'video': false};


    $scope.readSuccess = function(evt) { 
        // var field = document.getElementById('test');                        
        // field.innerHTML = evt.target.result;
        $scope.$apply( function() {
            $scope.uploadPreview = evt.target.result; 
            var URL = window.URL || window.webkitURL;
            /*console.log(URL);*/
            var fileURL = URL.createObjectURL(evt.target.result)
            videoNode.src = fileURL;
        }); 
    };

    $scope.reader = new FileReader();

    $scope.readURL = function(input, documentType) {
        if (input.files && input.files[0]) {
            var URL = window.URL || window.webkitURL;
            var fileURL = URL.createObjectURL(input.files[0])
            if(documentType) {
                document.querySelector('.documentPreview').data = fileURL;
            }
            else {
                document.querySelector('.imagePreview').src = fileURL;
            }
        }
    };

    $scope.previewUploadFile = function(){
        // var filename = event.target.files[0].name;
        // alert('file was selected: ' + filename);
        var file = $scope.myFile;
        /*console.log(file)*/
        $scope.uploadFileName = file.name;
        if(file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
            if(file.type == 'image/jpeg' || file.type == 'image/png') {
                $scope.$apply( function() {
                    $scope.srcStatus.image = true;
                    $scope.srcStatus.document = false;
                });
                $scope.readURL(this, false);
            }
            else if(file.type == 'application/pdf') {
                $scope.$apply( function() {
                    $scope.srcStatus.image = false;
                    $scope.srcStatus.document = true;
                });
                $scope.readURL(this, true);
            }
            else {
                $scope.$apply( function() {
                    $scope.srcStatus.image = false;
                    $scope.srcStatus.video = false;
                });
            }
        }
        else {
            alert('Check the file type submitted: Images(jpeg), Videos(mp4), Documents(Pdf) supported');
        }
        
    };

        $scope.previewUploadImage = function(){
        // var filename = event.target.files[0].name;
        // alert('file was selected: ' + filename);
        var file = $scope.myFile;
        /*console.log(file)*/
        $scope.uploadImageName = file.name;
        if(file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
            if(file.type == 'image/jpeg' || file.type == 'image/png') {
                $scope.$apply( function() {
                    $scope.srcStatus.image = true;
                    $scope.srcStatus.document = false;
                });
                $scope.readURL(this, false);
            }
            else if(file.type == 'application/pdf') {
                $scope.$apply( function() {
                    $scope.srcStatus.image = false;
                    $scope.srcStatus.document = true;
                });
                $scope.readURL(this, true);
            }
            else {
                $scope.$apply( function() {
                    $scope.srcStatus.image = false;
                    $scope.srcStatus.video = false;
                });
            }
        }
        else {
            alert('Check the file type submitted: Images(jpeg), Videos(mp4), Documents(Pdf) supported');
        }
        
    };

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        /*console.log('file is ' );
        console.dir(file);
        console.log('FileType is :' + file.type)*/

        if(file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
            var uploadUrl = "/fileUpload";
            fileUpload.uploadFileToUrl(file, uploadUrl);
        }
        else {
            alert('Check the file type submitted: Images(jpeg), Documents(Pdf) supported');
        }
    };

    $scope.uploadlink = function(){
        var videoLink = $scope.uploadVideoLink;
        var uploadUrl = "/linkUpload";
        fileUpload.uploadLinkToUrl(videoLink,uploadUrl);
        /*$http({
            url:'/linkUpload',
            method: 'POST',
            data: {"videoLink":videoLink},
        }).success(function(response){
            console.log(response);
        });*/
    };

    $scope.currImageIdx = -1;
    $scope.currImageSrc = '';

    $scope.getUserUploadedMedia_documents = function() {

        // Reset Upload view status
        $scope.srcStatus.image = false;
        $scope.srcStatus.document = false;

        data = {};
        /*console.log(data);*/

        $http({
            url: '/file_retrieve_documents',
            method: 'GET',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            $scope.uploadFileName = null;
            /*console.log(response);*/
            $scope.documentData = response;
        });
    };

    $scope.getPrevImage = function() {
        if($scope.currImageIdx > 0){
            $scope.currImageIdx = $scope.currImageIdx - 1;
        }
        else {
            $scope.currImageIdx =  $scope.imageData.length - 1;
        }
        $scope.currImageSrc = $scope.imageData[$scope.currImageIdx].src;
        console.log('Curr Image from Prev:' + $scope.currImageSrc);
    }

    $scope.getCurrentImage = function(val) {
        $scope.currImageIdx = val;
        $scope.currImageSrc = $scope.imageData[$scope.currImageIdx].src;
        console.log('Curr Image from Curr:' + $scope.currImageSrc);
    }

    $scope.getNextImage = function() {
        if($scope.currImageIdx < ($scope.imageData.length - 1)) {
            $scope.currImageIdx = $scope.currImageIdx + 1;
        }
        else {
            $scope.currImageIdx =  0;
        }
        
        $scope.currImageSrc = $scope.imageData[$scope.currImageIdx].src;
        console.log('Curr Image from Next:' + $scope.currImageSrc);
    }


    $scope.showPDF = function(val){
        window.open(this.href = val)
    }

    $scope.getUserUploadedMedia_images = function() {

        // Reset Upload view status
        $scope.srcStatus.image = false;
        $scope.srcStatus.document = false;

        data = {};
        /*console.log(data);*/

        $http({
            url: '/file_retrieve_images',
            method: 'GET',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            /*console.log(response);*/
            $scope.uploadImageName = null;
            $scope.imageData = response;
        });
    };

    $scope.getUserUploadedMedia_videos = function() {

        // Reset Upload view status
        $scope.srcStatus.image = false;
        $scope.srcStatus.document = false;
        $scope.srcStatus.video = false;

        data = {};
        /*console.log(data);*/

        $http({
            url: '/file_retrieve_videos',
            method: 'GET',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            /*console.log(response);*/
            $scope.uploadVideoLink = null;
            $scope.videoData = response;
        });
    };

    $scope.deleteDocument = function(idx) {
        console.log('Delete Document at index: ' + idx)
        $http({
            url: '/delete_document',
            method: 'POST',
            data: {"index":idx},
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            /*console.log(response);*/
            $scope.getUserUploadedMedia_documents();
        });
    }

    $scope.deleteImage = function(idx) {
        console.log('Delete Image at index: ' + idx)
        $http({
            url: '/delete_image',
            method: 'POST',
            data: {"index":idx},
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            /*console.log(response);*/
            $scope.getUserUploadedMedia_images();
        });
    }

    $scope.deleteVideo = function(idx) {
        console.log('Delete Embedded Video at index: ' + idx)
        $http({
            url: '/delete_video',
            method: 'POST',
            data: {"index":idx},
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            /*console.log(response);*/
            $scope.getUserUploadedMedia_videos();
        });
    }

    $scope.$on('eventFired', function(event, data) {
        $scope.getUserUploadedMedia_documents();
        $scope.getUserUploadedMedia_images();
        $scope.getUserUploadedMedia_videos();
    })
    

    $scope.getUserUploadedMedia_documents();
    $scope.getUserUploadedMedia_images();
    $scope.getUserUploadedMedia_videos();

}]);