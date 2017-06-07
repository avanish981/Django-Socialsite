// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userLanguagesController', ['$scope', '$http', 'userInfoSectionVisibility',
	function($scope, $http,userInfoSectionVisibility){
		
		$scope.data = "User Projects controller";

		
        $scope.getProfileInfoLanguages = function(){
            $http({
                url: '/language',
                method: 'GET',
                params: userInfoSectionVisibility.searchForUser,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.profileInfo_Languages = { 
                                                    "visibility" : true,
                                                    "title": "Languages",
                                                    "languages": response.languages
                                                };
                if($scope.profileInfo_Languages.visibility == true){
                    if (response.languages != "" ) {
                        userInfoSectionVisibility.sectionShow.Languages = true;
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.Languages = false;
                    }
                }
                else{
                    userInfoSectionVisibility.sectionShow.Languages = false;
                }
            });
        };

        $scope.getProfileInfoLanguages();

/*	$scope.profileInfo_Languages = {
        "visibility" : true,
        "title": "Languages",
        "languages":["English", "Hindi", "Marathi", "Gujarati"]
    };*/

}]);