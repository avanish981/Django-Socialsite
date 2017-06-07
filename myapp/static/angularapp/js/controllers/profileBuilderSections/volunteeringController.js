// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.directive('ngReallyClickOpportunities', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(scope.profileInfo_Volunteering.opportunitiesLookingFor.length == 1){
                    var message = attrs.ngReallyMessage;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.ngReallyClickOpportunities);
                    }
                }
                else {
                    scope.$apply(attrs.ngReallyClickOpportunities);
                }
            });
        }
    }
}]);

mySocialElite.directive('ngReallyClickCauses', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(scope.profileInfo_Volunteering.causes.length == 1){
                    var message = attrs.ngReallyMessage;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.ngReallyClickCauses);
                    }
                }
                else {
                    scope.$apply(attrs.ngReallyClickCauses);
                }
            });
        }
    }
}]);

mySocialElite.directive('ngReallyClickOrganization', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(scope.profileInfo_Volunteering.organizationSupported.length == 1){
                    var message = attrs.ngReallyMessage;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.ngReallyClickOrganization);
                    }
                }
                else {
                    scope.$apply(attrs.ngReallyClickOrganization);
                }
            });
        }
    }
}]);

mySocialElite.controller('volunteeringController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
		$scope.data = "Volunteering controller";

		$scope.volunteeringNewExperience = {
            "organizationName":"",
            "role":"",
            "cause":"",
            "startTime":"",
            "endTime":"",
            "description":"",
            "logo_url":""
		};

        $scope.volunteeringNewOpportunities = [{"name":""}];
        $scope.volunteeringNewCauses = [{"name":""}];
        $scope.volunteeringNewOrganizations = [{"name":""}];

    $scope.getProfileInfoVolunteering = function(){
            $http({
                url: '/volunteer',
                method: 'GET',
                data: {},
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
                                                }
            });
    };

    $scope.getProfileInfoVolunteering();

/*    $scope.getProfileInfoOpportunity = function(){
            $http({
                url: '/get_opportunities',
                method: 'GET',
                data: {},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                console.log(response.opportunities);
                $scope.profileInfo_Volunteering.opportunitiesLookingFor = response.opportunities;
            });
    };

    $scope.getProfileInfoOpportunity();*/



    $scope.addNewOpportunitiesRow = function() {
        var temp = { "name":""};
        $scope.volunteeringNewOpportunities.push(temp);
    }
    $scope.addNewCausesRow = function() {
        var temp = { "name":""};
        $scope.volunteeringNewCauses.push(temp);
    }
    $scope.addNewOrganizationsRow = function() {
        var temp = { "name":""};
        $scope.volunteeringNewOrganizations.push(temp);
    }

    $scope.addNewVolunteeringExperience = function() {
        setTimeout(function(){
            //console.log('Adding new volunteering Experience');
            $scope.$apply(function(){
                //console.log($scope.volunteeringNewExperience)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                url: '/volunteer',
                method: 'POST',
                data: $scope.volunteeringNewExperience,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                $scope.resetExperience();
                //console.log(response);
                $scope.getProfileInfoVolunteering();
            });
                // Reload the values
            })
        }, 10);

    }

    $scope.updateVolunteer = function(idx) {
        setTimeout(function(){
            //console.log('Updated Volunteer is: ' + idx)
            //console.log($scope.profileInfo_Volunteering.volunteering)

            $http({
                url: '/volunteer',
                method: 'PUT',
                data: {"index":idx,"volunteer":$scope.profileInfo_Volunteering.volunteering[idx]},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoVolunteering();
            });
        }, 10);

    };

    $scope.deleteVolunteer = function(idx) {
        //console.log('Deleting Volunteering position at index : ' + idx + '!');
        $http({
                url: '/volunteer',
                method: 'DELETE',
                data: {"index":idx},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoVolunteering();
            });
    }

    $scope.updateOpportunities = function() {
        setTimeout(function(){
            /*console.log('Updated Opportunity is: ' + idx)*/
            //console.log($scope.profileInfo_Volunteering.opportunitiesLookingFor)

            $http({
                url: '/opportunities',
                method: 'PUT',
                data: {"opportunities":$scope.profileInfo_Volunteering.opportunitiesLookingFor},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoVolunteering();
            });
        }, 10);

    };

    $scope.removeOpportunity = function(idx) {
        $scope.profileInfo_Volunteering.opportunitiesLookingFor.splice(idx,1);
        if($scope.profileInfo_Volunteering.opportunitiesLookingFor.length == 0) {
            $scope.updateOpportunities();
            $scope.editableFormVolunteeringOpportunities.$cancel();
        }
    }

    $scope.removeNewOpportunity = function(idx) {
        $scope.volunteeringNewOpportunities.splice(idx,1);

        if ($scope.volunteeringNewOpportunities.length == 0) {
            $scope.resetOpportunities();
            $scope.editableFormVolunteeringOpportunitiesNew.$cancel();
        }
    }

    // $scope.deleteOpportunities = function(idx) {
    //     console.log('Deleting Volunteering position at index : ' + idx + '!');
    // }

    $scope.updateCauses = function() {
        setTimeout(function(){
            /*console.log('Updated Opportunity is: ' + idx)*/
            //console.log($scope.profileInfo_Volunteering.causes)

            $http({
                url: '/cause',
                method: 'PUT',
                data: {"causes":$scope.profileInfo_Volunteering.causes},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoVolunteering();
            });
        }, 10);

    };

    $scope.removeCauses = function(idx) {
        $scope.profileInfo_Volunteering.causes.splice(idx,1);
        if($scope.profileInfo_Volunteering.causes.length == 0) {
            $scope.updateCauses();
            $scope.editableFormVolunteeringCauses.$cancel();
        }
    }

    $scope.removeNewCauses = function(idx) {
        $scope.volunteeringNewCauses.splice(idx,1);

        if ($scope.volunteeringNewCauses.length == 0) {
            $scope.resetCauses();
            $scope.editableFormVolunteeringCausesNew.$cancel();
        }
    }

    // $scope.deleteCauses = function(idx) {
    //     console.log('Deleting Volunteering position at index : ' + idx + '!');
    // }

    $scope.updateOrganizations = function() {
        setTimeout(function(){
            /*console.log('Updated Opportunity is: ' + idx)*/
            //console.log($scope.profileInfo_Volunteering.organizationSupported)

            $http({
                url: '/volunteer_organization',
                method: 'PUT',
                data: {"organizations":$scope.profileInfo_Volunteering.organizationSupported},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoVolunteering();
            });
        }, 10);

    };

    $scope.removeOrganizations = function(idx) {
        $scope.profileInfo_Volunteering.organizationSupported.splice(idx,1);
        if($scope.profileInfo_Volunteering.organizationSupported.length == 0) {
            $scope.updateOrganizations();
            $scope.editableFormVolunteeringOrganizations.$cancel();
        }
    }

    $scope.removeNewOrganizations = function(idx) {
        $scope.volunteeringNewOrganizations.splice(idx,1);

        if ($scope.volunteeringNewOrganizations.length == 0) {
            $scope.resetOrganizations();
            $scope.editableFormVolunteeringOrganizationsNew.$cancel();
        }
    }

    $scope.saveNewVolunteeringOpportunities = function() {
        setTimeout(function(){
            //console.log('Adding new volunteering Opportunities');
            $scope.$apply(function(){
                //console.log($scope.volunteeringNewOpportunities)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                url: '/opportunities',
                method: 'POST',
                data: $scope.volunteeringNewOpportunities,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                $scope.resetOpportunities();
                //console.log(response);
                $scope.getProfileInfoVolunteering();
                
            });
                // Reload the values
            })
        }, 10);

    }

    $scope.saveNewVolunteeringCauses = function() {
        setTimeout(function(){
            //console.log('Adding new volunteering Causes');
            $scope.$apply(function(){
                //console.log($scope.volunteeringNewCauses)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                url: '/cause',
                method: 'POST',
                data: $scope.volunteeringNewCauses,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                $scope.resetCauses();
                //console.log(response);
                $scope.getProfileInfoVolunteering();
                
            });
                // Reload the values
            })
        }, 10);

    }

    $scope.saveNewVolunteeringOrganizations = function() {
        setTimeout(function(){
            //console.log('Adding new volunteering Organizations');
            $scope.$apply(function(){
                //console.log($scope.volunteeringNewOrganizations)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                url: '/volunteer_organization',
                method: 'POST',
                data: $scope.volunteeringNewOrganizations,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                $scope.resetOrganizations();
                //console.log(response);
                $scope.getProfileInfoVolunteering();
                
            });
                // Reload the values
            })
        }, 10);

    };

    $scope.resetExperience = function() {
        $scope.volunteeringNewExperience.organizationName =  "";
        $scope.volunteeringNewExperience.role =  "";
        $scope.volunteeringNewExperience.startTime =  "";
        $scope.volunteeringNewExperience.endTime =  "";
        $scope.volunteeringNewExperience.cause =  "";
        $scope.volunteeringNewExperience.description = "";
        $scope.volunteeringNewExperience.logo_url = ""

    }

    $scope.resetOpportunities = function() {
        $scope.volunteeringNewOpportunities = [{"name":""}];
    }
    
    $scope.resetCauses = function() {
        $scope.volunteeringNewCauses = [{"name":""}];
    }

    $scope.resetOrganizations = function() {
        $scope.volunteeringNewOrganizations = [{"name":""}];
    }

    $scope.discardVolunteeringExperience = function() {
        $scope.resetExperience();
    };

    $scope.discardVolunteeringOpportunities = function() {
        $scope.resetOpportunities();
    };

    $scope.discardVolunteeringCauses = function() {
        $scope.resetCauses();
    };

    $scope.discardVolunteeringOrganizations = function() {
        $scope.resetOrganizations();
    };

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