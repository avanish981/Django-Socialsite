// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userMediaController', ['$scope', '$http', 'userInfoSectionVisibility', '$filter', 
    function($scope, $http, userInfoSectionVisibility, $filter){

    $scope.getUserUploadedMedia_documents = function() {
        data = {};

        $http({
            url: '/file_retrieve_documents',
            method: 'GET',
            params: userInfoSectionVisibility.searchForUser,
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            $scope.documentData = response;

            
            if (response != "" ) {
                userInfoSectionVisibility.sectionShow.Documents = true;
            }
            else{
                userInfoSectionVisibility.sectionShow.Documents = false;
            }
            
        });
    };

    $scope.showPDF = function(val){
        window.open(this.href = val)
    }

    $scope.currImageIdx = -1;
    $scope.currImageSrc = '';

    $scope.getUserUploadedMedia_images = function() {

        data = {};
        /*console.log(data);*/

        $http({
            url: '/file_retrieve_images',
            method: 'GET',
            params: userInfoSectionVisibility.searchForUser,
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            /*console.log(response);*/
            $scope.imageData = response;

            if (response != "" ) {
                userInfoSectionVisibility.sectionShow.Images = true;
            }
            else{
                userInfoSectionVisibility.sectionShow.Images = false;
            }
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
        //console.log('Curr Image from Prev:' + $scope.currImageSrc);
    }

    $scope.getCurrentImage = function(val) {
        $scope.currImageIdx = val;
        $scope.currImageSrc = $scope.imageData[$scope.currImageIdx].src;
        //console.log('Curr Image from Curr:' + $scope.currImageSrc);
    }

    $scope.getNextImage = function() {
        if($scope.currImageIdx < ($scope.imageData.length - 1)) {
            $scope.currImageIdx = $scope.currImageIdx + 1;
        }
        else {
            $scope.currImageIdx =  0;
        }
        
        $scope.currImageSrc = $scope.imageData[$scope.currImageIdx].src;
        //console.log('Curr Image from Next:' + $scope.currImageSrc);
    }

    $scope.getUserUploadedMedia_videos = function() {

        data = {};
        /*console.log(data);*/

        $http({
            url: '/file_retrieve_videos',
            method: 'GET',
            params: userInfoSectionVisibility.searchForUser,
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            /*console.log(response);*/
            $scope.videoData = response;
            if (response != "" ) {
                userInfoSectionVisibility.sectionShow.Videos = true;
            }
            else{
                userInfoSectionVisibility.sectionShow.Videos = false;
            }
        });
    };    

    $scope.getUserUploadedMedia_documents();
    $scope.getUserUploadedMedia_images();
    $scope.getUserUploadedMedia_videos();

}]);