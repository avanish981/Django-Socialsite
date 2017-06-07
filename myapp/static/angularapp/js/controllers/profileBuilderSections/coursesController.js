// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.directive('ngReallyClickCourses', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(scope.profileInfo_Courses.courses[scope.CurrentEditIndex].courseInfo.length == 1){
                    var message = attrs.ngReallyMessage;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.ngReallyClickCourses);
                    }
                }
                else {
                    scope.$apply(attrs.ngReallyClickCourses);
                }
            });
        }
    }
}]);

mySocialElite.controller('coursesController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
        $scope.CurrentEditIndex = '';
		$scope.data = "courses controller";

		$scope.coursesNew = [
            {
                "name":"", 
                "number":"",
                "associatedWith":""
            }
		];

		$scope.getProfileInfoCourses = function(){
                $http({
                    url: '/course',
                    method: 'GET',
                    data: {},
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.profileInfo_Courses = { 
                                                        "visibility" : true,
                                                        "title": "Courses",
                                                        "courses": response.courses
                                                    }
                });
        };

    $scope.getProfileInfoCourses();
	
    $scope.addNewCourseRow = function() {
        var temp = { "name":"", "number":"", "associatedWith":"" };
        $scope.coursesNew.push(temp);
    }

    $scope.saveNewCourses = function() {
        setTimeout(function(){
            //console.log('Adding new Courses');
            $scope.$apply(function(){
                //console.log($scope.coursesNew)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                    url: '/course',
                    method: 'POST',
                    data: $scope.coursesNew,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    $scope.reset();
                    //console.log(response);
                    $scope.getProfileInfoCourses();
                });
                // Reload the values
            })
        }, 10);

    }

    $scope.updateCourses = function(idx) {
        setTimeout(function(){
            //console.log('Updated Course is: ' + idx)
            //console.log($scope.profileInfo_Courses.courses[idx])

            $http({
                url: '/course',
                method: 'PUT',
                data: {"index":idx,"courses":$scope.profileInfo_Courses.courses[idx]},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoCourses();
            });
        }, 10);

    };

    $scope.setEditCourseIndex = function(idx, flag) {
        // console.log('Currently Editing course at index: '+ idx)
        if (flag ==  1) {
            $scope.CurrentEditIndex = idx;
        }
        else {
            $scope.CurrentEditIndex = '';   
        }
    }

    $scope.removeCourse = function(idx) {
        //console.log('Remove course at index: '+ idx +';  for associatedWith index: '+ $scope.CurrentEditIndex);
        $scope.profileInfo_Courses.courses[$scope.CurrentEditIndex].courseInfo.splice(idx, 1);

        
        if($scope.profileInfo_Courses.courses[$scope.CurrentEditIndex].courseInfo.length == 0) {
            /*$scope.updateCourses($scope.CurrentEditIndex);*/
            $http({
                url: '/course',
                method: 'DELETE',
                data: {"index":$scope.CurrentEditIndex},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoCourses();
            });
        }
    }

    $scope.removeNewCourse = function(idx) {
        $scope.coursesNew.splice(idx,1);

        if ($scope.coursesNew.length == 0) {
            $scope.reset();
            $scope.editableFormCoursesNew.$cancel();
        }
    }

    $scope.deleteCourses = function(idx) {
        $scope.profileInfo_Courses.courses[idx].courseInfo = [];
        /*$scope.updateCourses(idx);*/
        $http({
                url: '/course',
                method: 'DELETE',
                data: {"index":$scope.CurrentEditIndex},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoCourses();
            });
    }

    $scope.reset = function() {
        var temp = [{ "name":"", "number":"", "associatedWith":"" }];
        $scope.coursesNew = temp;
    }

    $scope.discardCourses = function() {
        $scope.reset();
    };

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