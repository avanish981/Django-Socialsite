var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('profileController', ['$scope', '$http', 'myservice', '$document', 
	function($scope, $http, myservice, $document){

    $scope.jumpTo = function(id) {
        var element = angular.element(document.getElementById(id));
        $document.scrollTo(element,60,1000);
    }

	// create a message to display in our view    
    $scope.ProfileMessage = 'Profile Controller Called !!!';  
    $scope.myservice = myservice;
    
    $scope.sectionInfo = {
        'Summary': {'src' : '/static/angularapp/html/profileBuilderSections/summary.html'},
        'Experience': {'src' : '/static/angularapp/html/profileBuilderSections/experience.html'},
        'Organizations': {'src' : '/static/angularapp/html/profileBuilderSections/organizations.html'},
        'Courses': {'src' : '/static/angularapp/html/profileBuilderSections/courses.html'},
        'Projects': {'src' : '/static/angularapp/html/profileBuilderSections/projects.html'},
        'Volunteering': {'src' : '/static/angularapp/html/profileBuilderSections/volunteering.html'},
        'Publications': {'src' : '/static/angularapp/html/profileBuilderSections/publications.html'},
        'Languages': {'src' : '/static/angularapp/html/profileBuilderSections/languages.html'},
        'Education': {'src' : '/static/angularapp/html/profileBuilderSections/education.html'},
        'AdditionalInfo' : {'src' : '/static/angularapp/html/profileBuilderSections/additionalInfo.html'},
        'Media' : {'src' : '/static/angularapp/html/profileBuilderSections/media.html'},
        'Calendar' : {'src' : '/static/angularapp/html/profileBuilderSections/calendar.html'}
    };

    $scope.currentView = {
        'upNext' : 'My Calendar',
        'upNextIcon' : 'glyphicon glyphicon-calendar',
        'calendarView' : false,
        'profileView' : true
    }

    $scope.switchView = function(){
        if($scope.currentView.upNext == 'My Calendar'){
            val = 1;
        }
        else if($scope.currentView.upNext == 'My Profile'){
            val = 0;
        }

        if(val == 0) {
            $scope.currentView = {
                'upNext' : 'My Calendar',
                'upNextIcon' : 'glyphicon glyphicon-calendar',
                'calendarView' : false,
                'profileView' : true
            }            
        }
        else if(val == 1){
            $scope.currentView = {
                'upNext' : 'My Profile',
                'upNextIcon' : 'glyphicon glyphicon-user',
                'calendarView' : true,
                'profileView' : false
            }
        }
    }


    
}]);

