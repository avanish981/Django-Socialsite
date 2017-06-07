// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userEducationController', ['$scope', '$http', 'userInfoSectionVisibility',
	function($scope, $http, userInfoSectionVisibility){
		
        $scope.CurrentEditIndex = '';
		$scope.data = "education controller";

		$scope.getProfileInfoEducation = function(){
                $http({
                    url: '/education',
                    method: 'GET',
                    params: userInfoSectionVisibility.searchForUser,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.profileInfo_Education = { 
                                                        "visibility" : true,
                                                        "title": "Education",
                                                        "education": response.education
                                                    };
                    if($scope.profileInfo_Education.visibility == true){
                        if (response.education != "" ) {
                            userInfoSectionVisibility.sectionShow.Education = true;
                        }
                        else{
                            userInfoSectionVisibility.sectionShow.Education = false;
                        }
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.Education = false;
                    }
                });
        };

        $scope.getProfileInfoEducation();
	
    
/*	$scope.profileInfo_Education = { 
        "visibility" : true,
        "title": "Education",
        "education": [
            {
                "schoolName":"University of Southern California",
                "startTime":"January 2014",
                "endTime":"May 2015",
                "degree":"Master of Science (MS)",
                "fieldOfStudy":"Electrical Engineering",
                "grade":"A",
                "school_logo":"/static/angularapp/images/usc_logo.jpeg",
                "activitiesAndSociety":[{"name":"USC Student Alumni Association"}],
                "description":"Practical and intense learning",
                "numberOfProjects":"6",
                "numberOfCourses":"9"
            },
            {
                "schoolName":"University of Mumbai",
                "startTime":"September 2009",
                "endTime":"May 2013",
                "degree":"Bachelor of Engineeirng (B Eng.)",
                "fieldOfStudy":"Electronics and Telecommunication Engineeirng",
                "grade":"",
                "school_logo":"/static/angularapp/images/MU_logo.jpeg",
                "activitiesAndSociety":[{"name":"IEEE"},{"name":"Placement Cell"}],
                "description":"Student Co-ordinator @ Placement Cell \nChairperson @ IEEE Student Branch \nEvent Organiser for Inter College Debate Competition @ IRIS (Cultural Fest)",
                "numberOfProjects":"1",
                "numberOfCourses":""
            },
        ]
    };*/


}]);