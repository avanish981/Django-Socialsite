// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userPublicationsController', ['$scope', '$http', 'userInfoSectionVisibility',
	function($scope, $http, userInfoSectionVisibility){
		
		$scope.data = "User publications controller";

    	$scope.getProfileInfoPublications = function(){
            $http({
                url: '/publication',
                method: 'GET',
                params: userInfoSectionVisibility.searchForUser
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.profileInfo_Publications = { 
                                                    "visibility" : true,
                                                    "title": "Publications",
                                                    "publications": response.publications
                                                };
                if($scope.profileInfo_Publications.visibility == true){
                    if (response.publications != "" ) {
                        userInfoSectionVisibility.sectionShow.Publications = true;
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.Publications = false;
                    }
                }
                else{
                    userInfoSectionVisibility.sectionShow.Publications = false;
                }
            });
        };

        $scope.getProfileInfoPublications();
	
    
	/*$scope.profileInfo_Publications = { 
        "visibility" : true,
        "title": "Publications",
        "publications": [
            {
                "title":"Performance Evaluation of Edge-based Video Error Concealment using H.264 Flexible Macroblock Ordering",
                "publication_publisher":"International Journal of Computer Science and Engineering Technology",
                "date":"December 2012",
                "publication_url":"http://www.ijcset.com/docs/IJCSET12-03-12-014.pdf#!",
                "description":"This paper evaluates the directional interpolation scheme used widely for spatial error concealment in the H.264/AVC video coding standard using Flexible Macroblock Ordering (FMO). "
                                +"A mathematical analysis of FMO is presented to illustrate its effectiveness as an error resilience tool." 
                                +"Compared to the weighted pixel interpolation scheme of the test model, the directional interpolation "
                                +"scheme gives a relatively improved error concealment performance, since it preserves the edge direction of the damaged area by using the information from correctly received neighboring regions. However, the effectiveness of this technique depends on the method used for determining the dominant edge direction for the damaged area. Two methods are discussed, and simulations are conducted to test their performance for varied video content. Also, a variation of the commonly used PSNR quality metric is defined to obtain true performance results based on Jensen’s inequality.",
                "authors":[
                            {"name":"Saurabh Mistry", "profileUrl":""},
                            {"name":"Sannidhi Dixit", "profileUrl":""},
                            {"name":"Santosh Chapaneri", "profileUrl":""},
                ]
            },
        ]
    };*/


}]);