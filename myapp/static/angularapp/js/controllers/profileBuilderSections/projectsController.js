// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.directive('ngReallyClickProjects', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(scope.profileInfo_Projects.projects[scope.CurrentEditIndex].teamMembers.length == 1){
                    var message = attrs.ngReallyMessage;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.ngReallyClickProjects);
                    }
                }
                else {
                    scope.$apply(attrs.ngReallyClickProjects);
                }
            });
        }
    }
}]);

mySocialElite.controller('projectsController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
        $scope.CurrentEditIndex = '';
		$scope.data = "Projects controller";

		$scope.projectNew = {
            "projectName":"",
            "occupation":"",
            "startTime":"",
            "endTime":"",
            "description":"",
            "project_url":"",
            "teamMembers":[]
		};

    	$scope.getProfileInfoProjects = function(){
            $http({
                url: '/project',
                method: 'GET',
                data: {},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.profileInfo_Projects = { 
                                                    "visibility" : true,
                                                    "title": "Projects",
                                                    "projects": response.projects
                                                }
            });
        };

    $scope.getProfileInfoProjects();
	
    $scope.addNewMemberRow = function() {
        var temp = { "name":"", "profileUrl":""};
        $scope.projectNew.teamMembers.push(temp);
    }

    $scope.addNewMemberRowEditMode = function(idx) {
        var temp = { "name":"", "profileUrl":""};
        $scope.profileInfo_Projects.projects[idx].teamMembers.push(temp);
    }

    $scope.addNewProject = function() {
        setTimeout(function(){
            //console.log('Adding new project');
            $scope.$apply(function(){
                //console.log($scope.projectNew)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                    url: '/project',
                    method: 'POST',
                    data: $scope.projectNew,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.projectNew = {};
                    $scope.getProfileInfoProjects();
                });
                    // Reload the values
                })
        }, 10);

    }

    $scope.updateProjects = function(idx) {
        setTimeout(function(){
            //console.log('Updated Project is: ' + idx)
            //console.log($scope.profileInfo_Projects.projects[idx])

            $http({
                url: '/project',
                method: 'PUT',
                data: {"index":idx,"updateProject":$scope.profileInfo_Projects.projects[idx]},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoProjects();
            });
        }, 10);

    };

    $scope.setEditProjectIndex = function(idx, flag) {
        if (flag ==  1) {
            $scope.CurrentEditIndex = idx;
        }
        else {
            $scope.CurrentEditIndex = '';   
        }
    }

    $scope.removeMember = function(idx) {
        $scope.profileInfo_Projects.projects[$scope.CurrentEditIndex].teamMembers.splice(idx, 1);
    }

    $scope.removeNewMember = function(idx) {
        $scope.projectNew.teamMembers.splice(idx, 1);
    }

    $scope.deleteProjects = function(idx) {
        //console.log('Deleting Project at index : ' + idx + '!');
        $http({
                url: '/project',
                method: 'DELETE',
                data: {"index":idx},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoProjects();
            });
    }

    $scope.reset = function() {
        $scope.projectNew.projectName =  "";
        $scope.projectNew.occupation =  "";
        $scope.projectNew.startTime =  "";
        $scope.projectNew.endTime =  "";
        $scope.projectNew.description =  "";
        $scope.projectNew.project_url = "";
        $scope.projectNew.teamMembers = []

    }

    $scope.discardProject = function() {
        $scope.reset();
    };

/*	$scope.profileInfo_Projects = { 
        "visibility" : true,
        "title": "Projects",
        "projects": [
            {
                "projectName":"H.264 Video Error Concealment",
                "occupation":"Student at University of Mumbai",
                "startTime":"July 2012",
                "endTime":"",
                "description":"The  visual  distortions  that  occur  while  viewing  a  video  sequence  that  is  transmitted over an error prone channel is a necessary motivation for the research in the field of video error concealment. We exploited the spatial and temporal correlations in order to achieve refined error concealment schemes. We successfully implemented methods used in the Joint"
                            +"Model (JM) Reference software and few other algorithms suggested by various authors"
                            +"with experimental  results. The experimental results were used to quantify methods based on performance."
                            +"On implementing these error concealment schemes at the post decoder end the electronic"
                            +"application consumer  can  view  a better quality video irrespective of the packet losses" 
                            +"taking place over the error prone channel. The spatial concealment uses the concept of "
                            +"spatial  correlation  within  the  frame  whereas  temporal  error  concealment  carries  out" 
                            +"concealment  taking  into account the  correlation  from  the previous and/or the future "
                            +"frames. The quality metrics used for the analysis were PSNR and MSSIM.",
                "project_url":"http://www.authorstream.com/Presentation/hallowen16-1402941-h-264-video-error-concealment/",
                "teamMembers":[
                    {"name":"Saurabh Mistry", "profileUrl":""},
                    {"name":"Cavin D'souza", "profileUrl":""},
                    {"name":"Elveera Menezes", "profileUrl":""},
                    {"name":"Sannidhi Dixit", "profileUrl":""}
                ]
            },
            {
                "projectName":"TCP/UDP based Auction System",
                "occupation":"Student at University of Southern California",
                "startTime":"April 2014",
                "endTime":"",
                "description":"Devised an Online Auction System for virtual Buyers (Bidders) and Sellers. This system initiates a process to authenticate Sellers and then collect selling prices from individual sellers over TCP. The system then broadcasts items on sale to potential customers. The buyers once authorized make their bids simultaneously to the server. The server finds out the maximum price and finalizes sales to the respective bidder. This system utilizes TCP and UDP connections for various events in order to facilitate a fair, unbiased and safe auction.",
                "project_url":"",
                "teamMembers":[
                    {"name":"Saurabh Mistry", "profileUrl":""},
                ]
            },
        ]
    };*/


}]);