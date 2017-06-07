// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userProjectsController', ['$scope', '$http', 'userInfoSectionVisibility',
	function($scope, $http, userInfoSectionVisibility){
		
		$scope.data = "User Projects controller";

    	$scope.getProfileInfoProjects = function(){
            $http({
                url: '/project',
                method: 'GET',
                params: userInfoSectionVisibility.searchForUser,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.profileInfo_Projects = { 
                                                    "visibility" : true,
                                                    "title": "Projects",
                                                    "projects": response.projects
                                                };
                if($scope.profileInfo_Projects.visibility == true){
                    if (response.projects != "" ) {
                        userInfoSectionVisibility.sectionShow.Projects = true;
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.Projects = false;
                    }
                }
                else{
                    userInfoSectionVisibility.sectionShow.Projects = false;
                }
            });
        };

        $scope.getProfileInfoProjects();


	/*$scope.profileInfo_Projects = { 
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