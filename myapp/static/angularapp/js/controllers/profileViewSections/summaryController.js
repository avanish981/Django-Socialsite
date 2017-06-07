// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userSummaryController', ['$scope', '$http', 'userInfoSectionVisibility',
	function($scope, $http, userInfoSectionVisibility){
		
		$scope.data = "User Summary controller";

		$scope.getProfileInfoSummary = function(){
	       $http({
	           url: '/summary',
	           method: 'GET',
	           params: userInfoSectionVisibility.searchForUser,
	           // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	       }).success(function(response) {
	           /*console.log(response);*/
	           $scope.profileInfo_Summary = { 
	                                           "visibility" : true,
	                                           "title": "Summary",
	                                           "summary": response.summary
	                                        };
	            if($scope.profileInfo_Summary.visibility == true){
                    if (response.summary != "" ) {
                        userInfoSectionVisibility.sectionShow.Summary = true;
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.Summary = false;
                    }
                }
                else{
                    userInfoSectionVisibility.sectionShow.Summary = false;
                }
	       });
	    };

    	$scope.getProfileInfoSummary();
	
	/*$scope.profileInfo_Summary = { 
        "visibility" : true,
        "title": "Summary",
        "summary": "Software Engineering, Computer Vision, Digital Image Processing, Digital Video Processing, Graphics.\n\n Seeking Full time opportunities in Software Engineering for May 2015. \n\nInterested in opportunities to develop innovative solutions to challenges in Digital Multimedia applications and build products/services that are robust and have high impact."
	};*/

	
}]);