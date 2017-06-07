// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('organizationsController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
		$scope.data = "organizations controller";

		$scope.organizationsNew = {
            "organizationName":"",
            "positionHeld":"",
            "occupation":"",
            "startTime":"",
            "endTime":"",
            "additionalNotes":"",
            "logo_url":""
		};

		$scope.getProfileInfoOrganization = function(){
                $http({
                    url: '/organization',
                    method: 'GET',
                    data: {},
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.profileInfo_Organization = { 
                                                        "visibility" : true,
                                                        "title": "Organizations",
                                                        "organizations": response.organizations
                                                    }
                });
    };

    $scope.getProfileInfoOrganization();
	
    $scope.addNewOrganization = function() {
        setTimeout(function(){
            //console.log('Adding new Organization');
            $scope.$apply(function(){
                //console.log($scope.organizationsNew)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                    url: '/organization',
                    method: 'POST',
                    data: $scope.organizationsNew,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.reset();
                    $scope.getProfileInfoOrganization();
                });
                // Reload the values
            })
        }, 10);

    }

    $scope.updateOrganizations = function(idx) {
        setTimeout(function(){
            //console.log('Updated Organization is: ' + idx)
            //console.log($scope.profileInfo_Organization)

            $http({
                url: '/organization',
                method: 'PUT',
                data: {"index":idx,"updateOrganization":$scope.profileInfo_Organization.organizations[idx]},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoOrganization();
            });
        }, 10);

    };

    $scope.deleteOrganizations = function(idx) {
        //console.log('Deleting Organization at index : ' + idx + '!');
        $http({
                url: '/organization',
                method: 'DELETE',
                data: {"index":idx},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoOrganization();
            });
    } 

    $scope.reset = function() {
        $scope.organizationsNew.organizationName =  "";
        $scope.organizationsNew.positionHeld =  "";
        $scope.organizationsNew.occupation =  "";
        $scope.organizationsNew.startTime =  "";
        $scope.organizationsNew.endTime =  "";
        $scope.organizationsNew.additionalNotes =  "";
        $scope.organizationsNew.logo_url = "";
    }

    $scope.discardOrganization = function() {
        $scope.reset();
    };

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