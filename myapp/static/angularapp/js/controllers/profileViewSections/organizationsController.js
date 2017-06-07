// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('userOrganizationsController', ['$scope', '$http', 'userInfoSectionVisibility',
	function($scope, $http, userInfoSectionVisibility){
		
		$scope.data = "User organizations controller";

		$scope.getProfileInfoOrganization = function(){
                $http({
                    url: '/organization',
                    method: 'GET',
                    params: userInfoSectionVisibility.searchForUser,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.profileInfo_Organization = { 
                                                        "visibility" : true,
                                                        "title": "Organizations",
                                                        "organizations": response.organizations
                                                    };
                    if($scope.profileInfo_Organization.visibility == true){
                        if (response.organizations != "" ) {
                            userInfoSectionVisibility.sectionShow.Organizations = true;
                        }
                        else{
                            userInfoSectionVisibility.sectionShow.Organizations = false;
                        }
                    }
                    else{
                        userInfoSectionVisibility.sectionShow.Organizations = false;
                    }
                });
        };

        $scope.getProfileInfoOrganization();

	/*$scope.profileInfo_Organization = { 
        "visibility" : true,
        "title": "Organizations",
        "organizations": [
            {
                "organizationName":"IEEE-SFIT Student Branch",
                "positionHeld":"Chair-person",
                "occupation":"Student at University of Mumbai",
                "startTime":"August 2012",
                "endTime":"July 2013",
                "additionalNotes":"Conducted various technical events like \n Ethical Hacking Workshop, \nseminar on Radio link transmission at Mumbai's premiere radio channel, Radio Mirchi, \nMatlab Simulink hands-on training \na social awareness event, Blood Donation Drive \na poster making competition \"Ignite the fire in you\", where students portrayed various art pieces depicting the social causes which need to be addressed on the legal front as well as at an individual level.",
                "logo_url":"/static/angularapp/images/ieee_logo.jpeg"
            },
        ]
    };    */

}]);