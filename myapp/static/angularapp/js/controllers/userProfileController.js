var mySocialElite = angular.module('RoutingApp');

mySocialElite.service('userInfoSectionVisibility', function() {
    
    this.sectionShow = {
        'Summary': false,
        'Experience': false,
        'Organizations': false,
        'Courses': false,
        'Projects': false,
        'Volunteering': false,
        'Publications': false,
        'Languages': false,
        'Education': false,
        'AdditionalInfo' : false,
        'Documents' : false,
        'Images' : false,
        'Videos' : false,
        'Calendar' : true
    };
    this.searchForUser = {
        'emailId':false
    };
});


mySocialElite.controller('userProfileController', ['$scope', '$http', '$location', '$document', '$routeParams','userInfoSectionVisibility', 'myservice',
	function($scope, $http, $location, $document, $routeParams, userInfoSectionVisibility, myservice){

    $scope.jumpTo = function(id) {
        var element = angular.element(document.getElementById(id));
        $document.scrollTo(element,60,1000);
    }

    $scope.currentView = {
        'upNext' : 'Calendar',
        'upNextIcon' : 'glyphicon glyphicon-calendar',
        'calendarView' : false,
        'profileView' : true
    }

    $scope.switchView = function(){
        if($scope.currentView.upNext == 'Calendar'){
            val = 1;
        }
        else if($scope.currentView.upNext == 'Profile'){
            val = 0;
        }

        if(val == 0) {
            $scope.currentView = {
                'upNext' : 'Calendar',
                'upNextIcon' : 'glyphicon glyphicon-calendar',
                'calendarView' : false,
                'profileView' : true
            }            
        }
        else if(val == 1){
            $scope.currentView = {
                'upNext' : 'Profile',
                'upNextIcon' : 'glyphicon glyphicon-user',
                'calendarView' : true,
                'profileView' : false
            }
        }
    }

	// create a message to display in our view    
    $scope.userProfileMessage = 'USER Profile Controller Called !!!';  
    // $scope.myservice = myservice;
    $scope.sectionVisibility = userInfoSectionVisibility.sectionShow;

    $scope.sectionInfo = {
        'Summary': {'src' : '/static/angularapp/html/profileViewSections/summary.html'},
        'Experience': {'src' : '/static/angularapp/html/profileViewSections/experience.html'},
        'Organizations': {'src' : '/static/angularapp/html/profileViewSections/organizations.html'},
        'Courses': {'src' : '/static/angularapp/html/profileViewSections/courses.html'},
        'Projects': {'src' : '/static/angularapp/html/profileViewSections/projects.html'},
        'Volunteering': {'src' : '/static/angularapp/html/profileViewSections/volunteering.html'},
        'Publications': {'src' : '/static/angularapp/html/profileViewSections/publications.html'},
        'Languages': {'src' : '/static/angularapp/html/profileViewSections/languages.html'},
        'Education': {'src' : '/static/angularapp/html/profileViewSections/education.html'},
        'AdditionalInfo' : {'src' : '/static/angularapp/html/profileViewSections/additionalInfo.html'},
        'Media' : {'src' : '/static/angularapp/html/profileViewSections/media.html'},
        'Calendar' : {'src' : '/static/angularapp/html/profileViewSections/calendar.html'}
    };

    var self = this;
    //console.log($routeParams.username);
    userInfoSectionVisibility.searchForUser.emailId = $routeParams.username;
    $scope.profileInfo_Overview = '';

    $scope.getProfileOverview = function(){
            $http({
                url: '/overview',
                method: 'GET',
                params: userInfoSectionVisibility.searchForUser,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                console.log(response);
                $scope.profileInfo_Overview = { "user" : response.overview};
                if($scope.profileInfo_Overview.user == "") {
                    $location.path("/");
                }

            }).error(function() {
                $location.path("/");
            });
    };

    $scope.getProfileOverview();
    
    $scope.processFriendship = function() {
        console.log("Friendship status is: " + $scope.profileInfo_Overview.user.friendshipStatus);
        $http({
                url: '/friendship',
                method: 'POST',
                data: {"friendshipStatus":$scope.profileInfo_Overview.user.friendshipStatus,"toUser":userInfoSectionVisibility.searchForUser.emailId},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                $scope.profileInfo_Overview.user.friendshipStatus = response
                console.log(response);

            });

    }
}]);

