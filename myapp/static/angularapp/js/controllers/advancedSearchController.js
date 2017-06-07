mySocialElite.controller('advancedSearchController', ['$scope', '$http', 'myservice', '$routeParams','$location', function($scope, $http, myservice, $routeParams, $location) {

	$scope.searchCriteria = {
		'fullname':'',
		'university':'',
		'company':'',
		'position':''
	};

	$scope.searchPeople = function() {
		//console.log($scope.searchCriteria);
		// Make HTTP request here
		$http({
            url: '/advance_search',
            method: 'POST',
            data: $scope.searchCriteria,
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
        	$scope.searchedPeople = response.search_details
            console.log(response);
        });
	}

	//console.log('Name is: '+ $routeParams.name);
    $scope.searchCriteria.fullname = $routeParams.name;
    $scope.searchPeople();


    $scope.showUserProfile = function(emailId) {
    	/*if(id >= 0){*/
    		console.log('Index' + emailId);

    		$location.path("/user/"+emailId);
    	/*}*/
    }

    $scope.processFriendship = function(emailId,friendshipStatus) {
    	console.log("emailId is: "+emailId)
    	$http({
                url: '/friendship',
                method: 'POST',
                data: {"friendshipStatus":friendshipStatus,"toUser":emailId},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
            $scope.searchedPeople.friendshipStatus = response
            console.log(response);

        });
        //console.log($scope.searchedPeople[id].friendshipStatus);
    }

	// This holds the search result
	/*$scope.searchedPeople = [
	{
		'fullname':'Saurabh',
		'currentPosition':'Software Engineer',
		'currentCompany':'Infostretch Corporation',
		'joined':'12/12/2016',
		'connectionCount':'500',
		'displayPic':'static/angularapp/images/photo.jpg'
	},
	{
		'fullname':'Bhavin',
		'currentPosition':'QA Engineer',
		'currentCompany':'Infostretch Corporation',
		'joined':'12/12/2015',
		'connectionCount':'200',
		'displayPic':'http://robohash.org/sitsequiquia.png?size=120x120'
	},
	{
		'fullname':'Jette',
		'currentPosition':'Software Engineer',
		'currentCompany':'Infostretch Corporation',
		'joined':'12/12/2016',
		'connectionCount':'100',
		'displayPic':'http://robohash.org/sitsequiquia.png?size=120x120'
	},
	];*/
}]);