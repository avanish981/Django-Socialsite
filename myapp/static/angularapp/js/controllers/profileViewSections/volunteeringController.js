// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userVolunteeringController', ['$scope', '$http', 'userInfoSectionVisibility',
	function($scope, $http, userInfoSectionVisibility){
		
		$scope.data = "User Volunteering controller";

    $scope.getProfileInfoVolunteering = function(){
            $http({
                url: '/volunteer',
                method: 'GET',
                params: userInfoSectionVisibility.searchForUser,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.profileInfo_Volunteering = { 
                                                    "visibility" : true,
                                                    "title": "Volunteering",
                                                    "volunteering": response.volunteer,
                                                    "opportunitiesLookingFor": response.opprtunities,
                                                    "causes":response.causes,
                                                    "organizationSupported":response.support_orgs,
                                                };
                if($scope.profileInfo_Volunteering.visibility == true){
                    if (response.volunteer != "" || response.opprtunities != "" 
                        || response.causes != "" || response.support_orgs != "") {
                        userInfoSectionVisibility.sectionShow.Volunteering = true;
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.Volunteering = false;
                    }
                }
                else{
                    userInfoSectionVisibility.sectionShow.Volunteering = false;
                }
            });
    };

    $scope.getProfileInfoVolunteering();

	/*$scope.profileInfo_Volunteering = { 
        "visibility" : true,
        "title": "Volunteering",
        "volunteering": [
            {
                "organizationName":"Make a Difference",
                "role":"English Teacher",
                "cause":"Children",
                "startTime":"June 2011",
                "endTime":"February 2013",
                "description":"Taught basic English conversation and Grammar skills to underprivileged kids based on a curriculum provided by Cambridge University in order to help enhance self confidence and motivate the kids to learn and excel.",
                "logo_url":"/static/angularapp/images/mad_logo.jpeg"
            },
        ],
        "opportunitiesLookingFor":[{"name": "Joining a non-profit board"}],
        "causes":[{"name":"Education"}, {"name":"Environment"}, {"name":"Science and Technology"}],
        "organizationSupported":[{"name":"Make a Difference"}, {"name":"IEEE"}, {"name":"IEEE Signal Processing Society"}]
    };*/

}]);