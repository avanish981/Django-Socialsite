// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.controller('profileBuilderNewUserController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice, $parse, $compile){
		$scope.myservice = myservice;
		//console.log('Builder here!')

		$scope.sectionInfo = {
			'active':'Summary',
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

		$scope.stateIdxLabel = ['Summary','Experience','Organizations','Courses','Projects','Volunteering','Publications','Languages','Education','AdditionalInfo','Media', 'Calendar'];

		$scope.stateIdx = 0;
		$scope.state = $scope.sectionInfo[$scope.stateIdxLabel[0]]; 
		$scope.state['active'] = 'Summary';
		//console.log($scope.state)

		$scope.incrementState = function() {
			++$scope.stateIdx;
			if($scope.stateIdx >= $scope.stateIdxLabel.length) {
				$scope.stateIdx = 0;
			}
			
			$scope.state = $scope.sectionInfo[$scope.stateIdxLabel[$scope.stateIdx]];
		};

		$scope.switchStateTo = function(val) {
			$scope.state = $scope.sectionInfo[val];
			$scope.state['active'] = val;
			//console.log($scope.state)
		}
	
}]);