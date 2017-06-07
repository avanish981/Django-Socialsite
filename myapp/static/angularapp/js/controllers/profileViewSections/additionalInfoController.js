// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userAdditionalInfoController', ['$scope', '$http','userInfoSectionVisibility',
	function($scope, $http, userInfoSectionVisibility){
		
		$scope.data = "User additional Info controller";
        //console.log("get user is:");
        /*console.log(userInfoSectionVisibility.searchForUser)*/
		$scope.getProfileInfoAdditionalInfo = function(){
                $http({
                    url: '/additional_info',
                    method: 'GET',
                    params: userInfoSectionVisibility.searchForUser,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response.additional_info);
                    $scope.profileInfo_AdditionalInfo = { 
                                                        "visibility" : true,
                                                        "title": "Additional Information",
                                                        "additionalInfo": response.additional_info
                                                        };

                    if($scope.profileInfo_AdditionalInfo.visibility == true){
                        if (response.additional_info != "" ) {
                            userInfoSectionVisibility.sectionShow.AdditionalInfo = true;
                        }
                        else{
                            userInfoSectionVisibility.sectionShow.AdditionalInfo = false;
                        }
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.AdditionalInfo = false;
                    }
                });
        };

    $scope.getProfileInfoAdditionalInfo();

	// $scope.profileInfo_AdditionalInfo = { 
 //        "visibility" : true,
 //        "title": "Additional Information",
 //        "additionalInfo": [
 //            {
 //                "title":"Interests",
 //                "values":"New Technologies, Digital Photography, Adventure Sports. Music"
 //            },
 //            {
 //                "title":"Advice for Contacting",
 //                "values":"Opportunities in Software Engineering and Digital Signal Processing for Multimedia (Image and Video Processing, Computer Vision, Graphics etc.)"
 //                        +"\n\nContact Number: (323)373-6852"
 //                        +"\nPersonal Email: mistrysaurabh1@gmail.com"
 //                        +"\nUSC Email: spmistry@usc.edu"
 //            },
 //        ]
 //    };


}]);