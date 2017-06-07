// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('additionalInfoController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
		$scope.data = "additional Info controller";

		$scope.additionalInfoNew = {
            "title":"",
            "values":""
		};

		$scope.getProfileInfoAdditionalInfo = function(){
                $http({
                    url: '/additional_info',
                    method: 'GET',
                    data: {},
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    /*console.log(response);*/
                    $scope.profileInfo_AdditionalInfo = { 
                                                        "visibility" : true,
                                                        "title": "Additional Information",
                                                        "additionalInfo": response.additional_info
                                                    }
                });
    };

    $scope.getProfileInfoAdditionalInfo();

/*    $scope.updateAdditionalInfo = function(idx) {
        console.log('Updated Course is: ' + idx)
        console.log($scope.profileInfo_AdditionalInfo.additionalInfo[idx])

        $http({
            url: '/update_additional_info',
            method: 'POST',
            data: {"index":idx,"additional_info":$scope.profileInfo_AdditionalInfo.additionalInfo[idx]},
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            console.log(response);
        });

    };*/

    $scope.addNewAdditionalInfo = function() {
        setTimeout(function(){
            //console.log('Adding new additional info');
            $scope.$apply(function(){
                //console.log($scope.additionalInfoNew)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                    url: '/additional_info',
                    method: 'POST',
                    data: $scope.additionalInfoNew,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    $scope.reset();
                    //console.log(response);
                    $scope.getProfileInfoAdditionalInfo();
                });
                // Reload the values
            })
        }, 10);

    }

    $scope.updateAdditionalInfo = function(idx) {
        setTimeout(function(){
            //console.log('Updated Course is: ' + idx)
            //console.log($scope.profileInfo_AdditionalInfo.additionalInfo[idx])

            $http({
                url: '/additional_info',
                method: 'PUT',
                data: {"index":idx,"additional_info":$scope.profileInfo_AdditionalInfo.additionalInfo[idx]},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoAdditionalInfo();
            });
        }, 10);

    };

    $scope.deleteAdditonalInfo = function(idx) {
        //console.log('Deleting Additonal Info at index : ' + idx + '!');
        $http({
                url: '/additional_info',
                method: 'DELETE',
                data: {"index":idx},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoAdditionalInfo();
        });
    }

    $scope.reset = function() {
        $scope.additionalInfoNew.title =  "";
        $scope.additionalInfoNew.values =  "";
    }

    $scope.discardAdditionalInfo = function() {
        $scope.reset();
    };

/*	$scope.profileInfo_AdditionalInfo = { 
        "visibility" : true,
        "title": "Additional Information",
        "additionalInfo": [
            {
                "title":"Interests",
                "values":"New Technologies, Digital Photography, Adventure Sports. Music"
            },
            {
                "title":"Advice for Contacting",
                "values":"Opportunities in Software Engineering and Digital Signal Processing for Multimedia (Image and Video Processing, Computer Vision, Graphics etc.)"
                        +"\n\nContact Number: (323)373-6852"
                        +"\nPersonal Email: mistrysaurabh1@gmail.com"
                        +"\nUSC Email: spmistry@usc.edu"
            },
        ]
    };*/


}]);