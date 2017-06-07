// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userCoursesController', ['$scope', '$http','userInfoSectionVisibility', 
	function($scope, $http, userInfoSectionVisibility){
		
		$scope.data = "User courses controller";
		$scope.getProfileInfoCourses = function(){
            //console.log(userInfoSectionVisibility.searchForUser);
                $http({
                    url: '/course',
                    method: 'GET',
                    params: userInfoSectionVisibility.searchForUser,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.profileInfo_Courses = { 
                                                        "visibility" : true,
                                                        "title": "Courses",
                                                        "courses": response.courses
                                                    };
                    if($scope.profileInfo_Courses.visibility == true){
                        if (response.courses != "" ) {
                            userInfoSectionVisibility.sectionShow.Courses = true;
                        }
                        else{
                            userInfoSectionVisibility.sectionShow.Courses = false;
                        }
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.Courses = false;
                    }
                });
        };

        $scope.getProfileInfoCourses();
	
	/*$scope.profileInfo_Courses = { 
        "visibility" : true,
        "title": "Courses",
        "courses": [
            {
                "associatedWith":"University of Southern California",
                "courseInfo": [
                                {
                                    "name":"Introduction to Digital Signal Processing", 
                                    "number":"EE 483"
                                },
                                {
                                    "name":"Computer Networks",
                                    "number":"EE 450",
                                },
                                {
                                    "name":"Multimedia Data Compression",
                                    "number":"EE 669",
                                },
                                {
                                    "name":"Analysis of Algorithms",
                                    "number":"CSCI 570",
                                },
                                {
                                    "name":"Digital Image Processing",
                                    "number":"EE 569",
                                },
                                {
                                    "name":"Speech Recognition and processing for Multimedia",
                                    "number":"EE 519",
                                },
                                {
                                    "name":"3-D Graphics and Rendering",
                                    "number":"CSCI 580",
                                },
                                {
                                    "name":"Advanced Digital Signal Processing Lab",
                                    "number":"EE 586L",
                                },
                                {
                                    "name":"Directed Research",
                                    "number":"EE 590",
                                }
                ], 
                
            },
            {
                "associatedWith":"University of Mumbai",
                "courseInfo": [
                                {
                                    "name":"Cryptography",
                                    "number":"CRPT",
                                },
                                {
                                    "name":"Image Processing",
                                    "number":"IP",
                                },
                                {
                                    "name":"Analog and Digital IC",
                                    "number":"ADIC",
                                },
                                {
                                    "name":"Digital Communications",
                                    "number":"DCom",
                                },
                                {
                                    "name":"Engineering Drawing",
                                    "number":"ED",
                                }                
                ],  
                
            },
        ]
    };*/
      

}]);