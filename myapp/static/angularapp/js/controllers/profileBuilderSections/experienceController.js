// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('experienceController', ['$scope', '$http', 'fileUpload', 'myservice', 
    function($scope, $http, fileUpload, myservice){
        
        $scope.data = "Experience controller";

        $scope.experienceNew = {
            "companyName": "",
            "title": "",
            "location": "",
            "startTime": "",
            "endTime": "",
            "description": "",
            "logo_url": ""
        };

        $scope.getProfileInfoExperience = function(){
                $http({
                    url: '/experience',
                    method: 'GET',
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    /*console.log(response);*/
                    $scope.profileInfo_Experience = { 
                                                        "visibility" : true,
                                                        "title": "Experience",
                                                        "experience": response.experiences
                                                    }
                });
    };

    $scope.getProfileInfoExperience();
    
    $scope.addNewExperience = function() {
        setTimeout(function(){
            //console.log('Adding new experience');
            $scope.$apply(function(){
                //console.log($scope.experienceNew)
                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                    url: '/experience',
                    method: 'POST',
                    data: $scope.experienceNew,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.getProfileInfoExperience();
                    $scope.reset();
                });
                // Reload the values
            })
        }, 10);

    }

    $scope.updateExperience = function(idx) {
        setTimeout(function(){
            //console.log('Updated Experience is: ' + idx)
            // console.log($scope.profileInfo_Experience)
            updatedExperience =  {"index":idx,"updateExperience":$scope.profileInfo_Experience.experience[idx]}
            //console.log(updatedExperience)

            $http({
                url: '/experience',
                method: 'PUT',
                data: updatedExperience,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoExperience();
                /*$scope.profileInfo_Experience = { 
                                                    "visibility" : true,
                                                    "title": "Experience",
                                                    "experience": response.experiences
                                                }*/
            });
            
        }, 10);

    };

    $scope.deleteExperience = function(idx) {
        //console.log('Deleting Experience at index : ' + idx + '!');
        $http({
                url: '/experience',
                method: 'DELETE',
                data: {"index":idx},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoExperience();
            });
    }

    $scope.reset = function() {
        $scope.experienceNew.summary =  "";
        $scope.experienceNew.companyName =  "";
        $scope.experienceNew.title =  "";
        $scope.experienceNew.location =  "";
        $scope.experienceNew.startTime =  "";
        $scope.experienceNew.endTime =  "";
        $scope.experienceNew.description =  "";
        $scope.experienceNew.logo_url = "";
    }

    $scope.discardExperience = function() {
        $scope.reset();
    };

    /*$scope.profileInfo_Experience = { 
        "visibility" : true,
        "title": "Experience",
        "experience": [
            {
                "companyName":"Infostretch Corporation",
                "title":"Software Engineer",
                "location":"San Francisco Bay Area",
                "startTime":new Date('2015-08-01'.replace(/-/g, "/")),
                "endTime":"Present",
                "description":"Worked on In-vehicle GPS Navigation systems to create a solution for searching Points of Interest, Plotting them on the map, starting navigation simulation. \n I also worked on building a rapid web development tool for enterprises using AngularJS",
                "logo_url":"/static/angularapp/images/infostretch_logo.jpeg"
            },
            // {
            //     "companyName":"Aemass Inc",
            //     "title":"Software Engineering Intern",
            //     "location":"San Francisco City",
            //     "startTime":new Date('2015-06-01'.replace(/-/g, "/")),
            //     "endTime":new Date('2015-08-01'.replace(/-/g, "/")),
            //     "description":"Worked on real time 3-D reconstruction of a scene using 3/4 Kinect cameras. Transmisson of video frames over TCP/IP to avail a 3D viewing experience over browsers.",
            //     "logo_url":""
            // },
            // {
            //     "companyName":"Directed Research at USC",
            //     "title":"Directed Research",
            //     "location":"Los Angeles",
            //     "startTime":new Date('2015-01-01'.replace(/-/g, "/")),
            //     "endTime":new Date('2015-05-01'.replace(/-/g, "/")),
            //     "description":"In collaboration with USC Ming Hsieh Institute - Department of Electrical Engineering and Jules Stein Eye Institute, UCLA I conducted directed research in the field of Computer Vision and Video processing in order to automate and analyze the skill level of a resident doctor performing Capsulorhexis - A procedure performed during Cataract surgery. This analysis was based on the video captured during the surgery. Various computer vision algorithms were implemented in order to detect parameters quantifying the performance.",
            //     "logo_url":"/static/angularapp/images/usc_logo.jpeg"
            // },
            // {
            //     "companyName":"Indus Valley Partners India Pvt. Ltd",
            //     "title":"Associate Software Developer",
            //     "location":"Mumbai",
            //     "startTime":new Date('2013-06-01'.replace(/-/g, "/")),
            //     "endTime":new Date('2015-11-01'.replace(/-/g, "/")),
            //     "description":"Developed a software for 'GeoSteel LLC, Rustavi'​ to facilitate management of production and resources using AngulasJS MVC framework.. Worked on SSRS Reporting services in order to facilitate inventory management and Business analysis. \nWorked on a Project 'Providence' for managing and facilitating shares and mutual fund management along with third party integration.",
            //     "logo_url":"/static/angularapp/images/ivp_logo.jpeg"
            // }
        ]
    };*/


}]);