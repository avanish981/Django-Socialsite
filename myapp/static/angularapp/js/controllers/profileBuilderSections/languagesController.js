// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.directive('ngReallyClickLanguages', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(scope.profileInfo_Languages.languages.length == 1){
                    var message = attrs.ngReallyMessage;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.ngReallyClickLanguages);
                    }
                }
                else {
                    scope.$apply(attrs.ngReallyClickLanguages);
                }
            });
        }
    }
}]);

mySocialElite.controller('languagesController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
		$scope.data = "Projects controller";

		$scope.languagesNew = [{"name":""}];

    $scope.getProfileInfoLanguages = function(){
                $http({
                    url: '/language',
                    method: 'GET',
                    data: {},
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.profileInfo_Languages = { 
                                                        "visibility" : true,
                                                        "title": "Languages",
                                                        "languages": response.languages
                                                    }
                });
    };

    $scope.getProfileInfoLanguages();
	
    $scope.addNewLanguageRow = function() {
        var temp = {"name":""};
        $scope.languagesNew.push(temp);
    }

    $scope.saveNewLanguages = function() {
        setTimeout(function(){
            //console.log('Adding new languages');
            $scope.$apply(function(){
                //console.log($scope.languagesNew)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                    url: '/language',
                    method: 'POST',
                    data: $scope.languagesNew,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    //console.log(response);
                    $scope.reset();
                });
                // Reload the values
                $scope.getProfileInfoLanguages();
            })
        }, 10);

    }

    $scope.updateLanguage = function() {
        setTimeout(function(){
            //console.log('Updated Language')
            //console.log($scope.profileInfo_Languages.languages)

            $http({
                url: '/language',
                method: 'PUT',
                data: $scope.profileInfo_Languages.languages ,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                /*$scope.profileInfo_Experience = { 
                                                    "visibility" : true,
                                                    "title": "Experience",
                                                    "experience": response.experiences
                                                }*/
            });
        }, 10);
    };

    $scope.removeLanguage = function(idx) {
        $scope.profileInfo_Languages.languages.splice(idx, 1);
        
        if($scope.profileInfo_Languages.languages.length == 0) {
            $scope.updateLanguage();
            $scope.editableFormLanguages.$cancel();
        }
    }

    $scope.removeNewLanguage = function(idx) {
        $scope.languagesNew.splice(idx,1);

        if ($scope.languagesNew.length == 0) {
            $scope.reset();
            $scope.editableFormLanguagesNew.$cancel();
        }
    }

    $scope.deleteLanguages = function() {
        $scope.profileInfo_Languages.languages = [];
        $scope.updateLanguage();
    }

    $scope.reset = function() {        
        $scope.languagesNew = [{"name":""}]
    }

    $scope.discardProject = function() {
        $scope.reset();
    };

	/*$scope.profileInfo_Languages = {
        "visibility" : true,
        "title": "Languages",
        "languages":["English", "Hindi", "Marathi", "Gujarati"]
    };*/

}]);