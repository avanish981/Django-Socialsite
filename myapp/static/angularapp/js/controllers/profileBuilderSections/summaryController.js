// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('summaryController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
		$scope.data = "Summary controller";

		$scope.summaryNew = {
            "summary": "",
		};

		$scope.getProfileInfoSummary = function(){
	       $http({
	           url: '/summary',
	           method: 'GET',
	           data: {},
	           // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	       }).success(function(response) {
	           /*console.log(response);*/
	           $scope.profileInfo_Summary = { 
	                                           "visibility" : true,
	                                           "title": "Summary",
	                                           "summary": response.summary
	                                        }
	       });
	    };

    $scope.getProfileInfoSummary();
	
    $scope.addNewSummary = function() {
        setTimeout(function(){
            /*console.log('Adding new summary');*/
            $scope.$apply(function(){
                /*console.log($scope.summaryNew)*/

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
		            url: '/summary',
		            method: 'POST',
		            data: $scope.summaryNew,
		            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		        }).success(function(response) {
		        	$scope.summaryNew = {};
		            /*console.log(response);*/
		            $scope.getProfileInfoSummary();
		        });
                // Reload the values
            })
        }, 10);
    };

    $scope.updateSummary = function(idx) {
    	setTimeout(function(){
	        /*console.log('Updated Summary is: ' + idx)
	        console.log($scope.profileInfo_Summary.summary)*/

	        $http({
	            url: '/summary',
	            method: 'PUT',
	            data: {"summary":$scope.profileInfo_Summary.summary},
	            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	        }).success(function(response) {
	            /*console.log(response);*/
	            // Reload the values
                $scope.getProfileInfoSummary();
	        });
        }, 10);
    };

    $scope.deleteSummary = function(idx) {
		/*console.log('Deleting Summary at index : ' + idx + '!');*/
		$http({
	            url: '/summary',
	            method: 'DELETE',
	            data: {},
	            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	        }).success(function(response) {
	            /*console.log(response);*/
	            // Reload the values
                $scope.getProfileInfoSummary();
	        });

    }

    $scope.reset = function() {
    	$scope.summaryNew.summary =  "";
    }

    $scope.discardSummary = function() {
    	$scope.reset();
    };

	/*$scope.profileInfo_Summary = { 
        "visibility" : true,
        "title": "Summary",
        "summary": "Software Engineering, Computer Vision, Digital Image Processing, Digital Video Processing, Graphics.\n\n Seeking Full time opportunities in Software Engineering for May 2015. \n\nInterested in opportunities to develop innovative solutions to challenges in Digital Multimedia applications and build products/services that are robust and have high impact."
	};*/

	
}]);