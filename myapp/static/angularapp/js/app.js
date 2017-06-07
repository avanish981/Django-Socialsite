// create the module and name it mySocialElite    
var mySocialElite = angular.module('RoutingApp', ['ngRoute', 'ngCookies', 'videosharing-embed','duScroll','xeditable','mwl.calendar', 'ngAnimate', 'ui.bootstrap']);  

mySocialElite.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

// configure our routes    
mySocialElite.config(['$routeProvider', '$locationProvider', '$httpProvider',function($routeProvider, $locationProvider,$httpProvider) {  
    $routeProvider  
  
    // route for the Landing page    
    .when('/', {  
        templateUrl: 'static/angularapp/html/landing.html',  
        controller: 'landingController'  
    })
    
    //Playground - Development testing
    .when('/playground', {  
        templateUrl: 'static/angularapp/html/playground.html',  
        controller: 'playgroundController',
        controllerAs: 'vm' 
    })  
  
    // route for the about page    
    .when('/about', {  
        templateUrl: 'static/angularapp/html/about.html',  
        controller: 'aboutController'  
    })  
  
    // route for the contact page    
    .when('/contact', {  
        templateUrl: 'static/angularapp/html/contact.html',
        // controller: 'contactController'  
    })

    .when('/advancedSearch/:name', {  
        templateUrl: 'static/angularapp/html/advancedSearch.html',
        controller: 'advancedSearchController'  
    })

    .when('/profileBuilderNewUser', {  
        templateUrl: 'static/angularapp/html/profileBuilderNewUser.html',
        controller: 'profileBuilderNewUserController'  
    })

    .when('/profile', {  
        templateUrl: 'static/angularapp/html/profile.html',
        controller: 'profileController'  
    })

    .when('/user/:username', {
        templateUrl: 'static/angularapp/html/userProfile.html',
        controller: 'userProfileController'  
    })

    .when('/callbackGoogle', {  
        templateUrl: 'static/angularapp/html/oAuthCallback.html',
        controller: 'callbackGoogleController'  
    })

    .when('/callbackLinkedIn', {  
        templateUrl: 'static/angularapp/html/oAuthCallback.html',
        controller: 'callbackLinkedInController'  
    });  

    // use the HTML5 History API
    //check browser support
    if(window.history && window.history.pushState){
        /*
        $locationProvider.html5Mode(true); 
        will cause an error $location in HTML5 mode requires a  tag to be present!
        Unless you set baseUrl tag after head tag like so: <head> <base href="/">
        to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase
        */

     // if you don't wish to set base URL then use this
     $locationProvider.html5Mode({
             enabled: true,
             requireBase: false
      });
    }
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
     //$httpProvider.defaults.headers.common['X-CSRFToken'] = '{{ csrf_token|escapejs }}';
  
}]);  

mySocialElite.directive('scrollPosition', function($window) {
  return {
    scope: {
      scroll: '=scrollPosition'
    },
    link: function(scope, element, attrs) {
      var windowEl = angular.element($window);
      var handler = function() {
        scope.scroll = windowEl.scrollTop();
      }
      windowEl.on('scroll', scope.$apply.bind(scope, handler));
      handler();
    }
  };
});


mySocialElite.directive('jsonText', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: 'ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModelCtrl) {

      var lastValid;

      // push() if faster than unshift(), and avail. in IE8 and earlier (unshift isn't)
      ngModelCtrl.$parsers.push(fromUser);
      ngModelCtrl.$formatters.push(toUser);

      // clear any invalid changes on blur
      element.bind('blur', function() {
        element.val(toUser(scope.$eval(attrs.ngModel)));
      });

      // $watch(attrs.ngModel) wouldn't work if this directive created a new scope;
      // see http://stackoverflow.com/questions/14693052/watch-ngmodel-from-inside-directive-using-isolate-scope how to do it then
      scope.$watch(attrs.ngModel, function(newValue, oldValue) {
        lastValid = lastValid || newValue;

        if (newValue != oldValue) {
          ngModelCtrl.$setViewValue(toUser(newValue));

          // TODO avoid this causing the focus of the input to be lost..
          ngModelCtrl.$render();
        }
      }, true); // MUST use objectEquality (true) here, for some reason..

      function fromUser(text) {
        // Beware: trim() is not available in old browsers
        if (!text || text.trim() === '') {
          return {};
        } else {
          try {
            lastValid = angular.fromJson(text);
            ngModelCtrl.$setValidity('invalidJson', true);
          } catch (e) {
            ngModelCtrl.$setValidity('invalidJson', false);
          }
          return lastValid;
        }
      }

      function toUser(object) {
        // better than JSON.stringify(), because it formats + filters $$hashKey etc.
        return angular.toJson(object, true);
      }
    }
  };
});


// TODO: Temporary Controllers! Need to be moved to a seperate file
mySocialElite.controller('aboutController', function($scope) {  
    $scope.AboutMessage = 'About Controller Called !!!';  

    changePage = function() {
        window.location.href = 'contact';
    }
});  
  
mySocialElite.controller('contactController', function($scope) {  
    $scope.ContactMessage = 'Contact Controller Called !!!'; 
});  

mySocialElite.service('myservice', function() {
    this.user = {firstname: '',lastname: '', email: '', image: '', alldetails: ''};
    this.loggedIn = false;
    this.test = '';
});

