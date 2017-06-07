// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('educationController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
        $scope.CurrentEditIndex = '';
		$scope.data = "education controller";

		$scope.educationNew = {
            "schoolName":"",
            "startTime":"",
            "endTime":"",
            "degree":"",
            "fieldOfStudy":"",
            "grade":"",
            "school_logo":"",
            "activitiesAndSociety":[{"name":""}],
            "description":"",
            // "numberOfProjects":"6",
            // "numberOfCourses":"9"
		};

		$scope.getProfileInfoEducation = function(){
                $http({
                    url: '/education',
                    method: 'GET',
                    data: {},
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.profileInfo_Education = { 
                                                        "visibility" : true,
                                                        "title": "Education",
                                                        "education": response.education
                                                    }
                });
    };

    $scope.getProfileInfoEducation();
	
    $scope.addNewActivityRow = function() {
        var temp = { "name":"", "profileUrl":""};
        $scope.educationNew.activitiesAndSociety.push(temp);
    }

    $scope.addNewActivityRowEditMode = function(idx) {
        var temp = { "name":""};
        $scope.profileInfo_Education.education[idx].activitiesAndSociety.push(temp);
    }


    $scope.addNewEducation = function() {
        setTimeout(function(){
            //console.log('Adding new education');
            $scope.$apply(function(){
                //console.log($scope.educationNew)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                    url: '/education',
                    method: 'POST',
                    data: $scope.educationNew,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    $scope.reset();
                    $scope.getProfileInfoEducation();
                });
                // Reload the values
            })
        }, 10);

    }

    $scope.updateEducation = function(idx) {
        setTimeout(function(){
            //console.log('Updated Education is: ' + idx)
            //console.log($scope.profileInfo_Education.education[idx])
            updatedEducation =  {"index":idx,"updateEducation":$scope.profileInfo_Education.education[idx]}
            $http({
                url: '/education',
                method: 'PUT',
                data: updatedEducation,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                /*console.log(response);*/
            $scope.getProfileInfoEducation();
            });
        }, 10);
    }

    $scope.setEditEducationIndex = function(idx, flag) {
        if (flag ==  1) {
            $scope.CurrentEditIndex = idx;
        }
        else {
            $scope.CurrentEditIndex = '';   
        }
    }

    $scope.removeActivity = function(idx) {
        $scope.profileInfo_Education.education[$scope.CurrentEditIndex].activitiesAndSociety.splice(idx, 1);
    }

    $scope.removeNewActivity = function(idx) {
        $scope.educationNew.activitiesAndSociety.splice(idx, 1);
    }

    $scope.deleteEducation = function(idx) {
        //console.log('Deleting Education at index : ' + idx + '!');
        $http({
                url: '/education',
                method: 'DELETE',
                data: {"index":idx},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoEducation();
            });
    }


    $scope.reset = function() {
        $scope.educationNew.schoolName =  "";
        $scope.educationNew.degree =  "";
        $scope.educationNew.fieldOfStudy =  "";
        $scope.educationNew.grade =  "";
        $scope.educationNew.startTime =  "";
        $scope.educationNew.endTime =  "";
        $scope.educationNew.school_logo = "";
        $scope.educationNew.description =  "";
        $scope.educationNew.activitiesAndSociety = [{"name":""}];
    }

    $scope.discardEducation = function() {
        $scope.reset();
    };

	/*$scope.profileInfo_Education = { 
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