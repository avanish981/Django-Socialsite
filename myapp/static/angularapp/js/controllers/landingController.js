    // create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

// mySocialElite.directive('ngBlur', ['$parse', function($parse) {
//     return function(scope, element, attr) {
//         var fn = $parse(attr['ngBlur']);
//         element.on('blur', function(event) {
//             scope.$apply(function() {
//                 fn(scope, {$event:event});
//             });
//         });
//     };
// }]);

mySocialElite.directive('typeahead', ['$timeout', '$document','$parse', '$location', function( $timeout, $document, $parse , $location){
  return {
    restrict: 'AEC',
    scope: {
        items: '=',
        prompt:'@',
        title: '@',
        subtitle1:'@',
        subtitle2:'@',
        photo:'@',
        model: '=',
        onSelect:'&',
        onChange:'&',
        onBlur:'&'
    },
    link:function(scope,elem,attrs){
       scope.handleSelection=function(selectedItem, idx){
            console.log(selectedItem+', '+idx)
            scope.model=selectedItem.fullname;
            scope.current=0;
            scope.selected=true;        
            $timeout(function(){
                scope.onSelect({arg: selectedItem.emailId});
                // scope.onSearchItemSelected(selectedItem.fullname);
            },200);
        };
        scope.current=0;
        scope.selected=true;
        scope.isCurrent=function(index){
            return scope.current==index;
        };
        scope.setCurrent=function(index){
            scope.current=index;
        };

        scope.goToAdvancedSearch = function(){
            scope.items = '';
            $location.path("/advancedSearch/" + scope.model);
        }


        // var scopeExpression = attrs.outsideClick,
        // onDocumentClick = function(event){
        //     var isChild = elem.find(event.target).length > 0;
        //     if(!isChild) {
        //         scope.$apply(scopeExpression);
        //     }
        // };

        // $document.on("click", onDocumentClick);

        // elem.on('$destroy', function() {
        //     $document.off("click", onDocumentClick);
        // });

    },
    templateUrl: 'static/angularapp/html/mainSearchResultTemplate.html'
  }
}]);

mySocialElite.directive("outsideClick", ['$document','$parse', function( $document, $parse ){
    return {
        link: function( $scope, $element, $attributes ){
            var scopeExpression = $attributes.outsideClick,
                onDocumentClick = function(event){
                    var isChild = $element.find(event.target).length > 0;

                    if(!isChild) {
                        $scope.$apply(scopeExpression);
                    }
                };

            $document.on("click", onDocumentClick);

            $element.on('$destroy', function() {
                $document.off("click", onDocumentClick);
            });
        }
    }
}]);

mySocialElite.controller('landingController', ['$scope', '$http', 'myservice', '$location', function($scope, $http, myservice, $location) {

    // create a message to display in our view    
    $scope.myservice = myservice;
    
    $scope.LandingMessage = 'Landing Controller Called !!!';  
    var mainurl = "https://localhost:8000"
    $scope.scroll = 0;
    /*$scope.loginlogout = true;*/
    $scope.login = { username : '', password :  '' };
    
    $scope.signUp = {first_name: '', last_name : '', email : '', password: '', confirmPassword: ''};
    // Sign in from Google
    $scope.login_Google = function() {
        var url = "https://accounts.google.com/o/oauth2/v2/auth?";
        var scope = "scope=email profile&";
        var state = "state=987654321&";
        var redirect_uri = "redirect_uri="+mainurl+"/callbackGoogle&";
        var response_type = "response_type=code&";
        var client_id = "client_id=509969686826-n6iahscnfpn7ebqo47kjgnov6k4oqbgf.apps.googleusercontent.com";
        request_url = url+scope+state+redirect_uri+response_type+client_id;
        /*console.log('Request URL Google is: '+request_url);*/
        window.location.href = request_url; 
    }

    $scope.login_LinkedIn = function() {
        var url = "https://www.linkedin.com/uas/oauth2/authorization?";
        var response_type = "response_type=code&";
        var client_id = "client_id=75y4e2gztxa2tx&";
        var redirect_uri = "redirect_uri="+mainurl+"/callbackLinkedIn&";
        var state = "state=987654321&";
        var scope = "scope=r_basicprofile%20r_emailaddress";
        request_url = url+response_type+client_id+redirect_uri+state+scope;
        /*console.log('Request URL LinkedIn is: '+request_url);*/
        window.location.href = request_url; 
    }

    $scope.login = function() {
        $scope.print = 'Username: ' + $scope.login.username + 'Password: ' + $scope.login.password;
        
        var inData = {'username' : $scope.login.username, 'password' : $scope.login.password }; 
        /*console.log(inData)
        console.log(inData['username'] + inData['password'])*/


        $http({
            /*url: '/login',*/
            url: '/api/v1/auth/login/',
            method: 'POST',
            data: inData,
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
                //console.log(response);
                if(response.status == 'Unauthorized'){
                    alert(response.message);
                }
                else{
                    alert("Login Successful");
                     myservice.loggedIn = true;
                     $location.path("/profile");
                } 
        });
    }

/*    $scope.login = function() {
        $scope.print = 'Username: ' + $scope.login.username + 'Password: ' + $scope.login.password;
        
        var inData = {'username' : $scope.login.username, 'password' : $scope.login.password }; 

        $http({
            url: '/login',
            method: 'POST',
            data: inData,
        }).success(function(response) {
                console.log(response);
                if(response == "USER FOUND"){
                  alert("Login Successful");
                  myservice.loggedIn = true;
                  $location.path("/profile");
                }
                else{
                    alert (response);
                    console.log(response);
                } 
        });
    }*/

    $scope.submit = function(){
        if($scope.signUp.password!=$scope.signUp.confirmPassword){
            alert("Password didn't match");
        }
        else{

        data = {
                'first_name':$scope.signUp.first_name,
                'last_name':$scope.signUp.last_name,
                'username':$scope.signUp.email,
                'password':$scope.signUp.password
            };
        /*console.log(data);*/

        $http({
            /*url: '/insert_user',*/
            url: '/api/v1/accounts/',
            method: 'POST',
            data: data,
            // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(response) {
                /*console.log(response);*/
                $scope.signUp = null;
                /*console.log($scope.signUp);*/
                alert("Account Successfully Created. Please try to login with your crendentials.");
        });
        }
    }


    $scope.signout = function(){
                    $http({
                          url: '/api/v1/auth/logout/',
                          method: 'POST',
                          data: {},
                    }).success(function(response){
                                /*console.log('User signed out.');*/
                                myservice.loggedIn = false;
                                $location.path("/");
                        });

    }    

/*    $scope.signout = function(){
                    $http({
                          url: '/logout',
                          method: 'POST',
                          data: {},
                    }).success(function(response){
                                myservice.loggedIn = false;
                                $location.path("/");
                        });

    }*/

    $scope.getcoverCarouselImages = function(){
            $http({
                url: '/get_cover_images',
                method: 'GET',
                data: {},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                /*console.log(response);*/
                $scope.coverCarouselImages = response.coverImages;
            });
    };
    $scope.getcoverCarouselImages();


    //Load Carousel with animation
    //Function to animate slider captions 
    function doAnimations( elems ) {
        //Cache the animationend event in a variable
        var animEndEv = 'webkitAnimationEnd animationend';
        
        elems.each(function () {
            var $this = $(this),
                $animationType = $this.data('animation');
            $this.addClass($animationType).one(animEndEv, function () {
                $this.removeClass($animationType);
            });
        });
    }
    
    //Variables on page load 
    var $myCarousel = $('#carousel-example-generic'),
        $firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");
        
    //Initialize carousel 
    $myCarousel.carousel();
    
    //Animate captions in first slide on page load 
    doAnimations($firstAnimatingElems);
    
    //Pause carousel  
    // $myCarousel.carousel('pause');
    
    
    //Other slides to be animated on carousel slide event 
    $myCarousel.on('slide.bs.carousel', function (e) {
        var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
        doAnimations($animatingElems);
    });
    //End Carousel with animation


    //Cover carousel
    /*$scope.coverCarouselImages = [
        {
            "src":"static/angularapp/images/cover_images/1.jpg",
            "dataColor":"lightblue",
            "alt":"First Image",
            "caption":"First Image",
            "idx":"0"
        },
        {
            "src":"https://unsplash.it/2000/1040?image=689",
            "dataColor":"firebrick",
            "alt":"Second Image",
            "caption":"Second Image",
            "idx":"1"
        },
        {
            "src":"https://unsplash.it/2000/1040?image=675",
            "dataColor":"violet",
            "alt":"Third Image",
            "caption":"Third Image",
            "idx":"2"
        },
        {
            "src":"https://unsplash.it/2000/1040?image=658",
            "dataColor":"lightgreen",
            "alt":"Fourth Image",
            "caption":"Fourth Image",
            "idx":"3"
        },
        {
            "src":"https://unsplash.it/2000/1040?image=638",
            "dataColor":"tomato",
            "alt":"Fifth Image",
            "caption":"Fifth Image",
            "idx":"4"
        },
    ]*/

    $scope.mainSearchText='';
    $scope.name="";

    $scope.mainSearchTextChanged = function() {
        //console.log('search text changed');

        setTimeout(function(){
            $scope.$apply(function(){
                //console.log($scope.name)
                if($scope.name.length == 2) {
                    //console.log('make get Request');
                    $http({
                        url: '/search',
                        method: 'POST',
                        data: $scope.name,
                        // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                    }).success(function(response) {
                        //console.log(response);
                        $scope.items = response.search_details;
                    });
                }
                else if($scope.name.length < 2) {
                    $scope.items = '';
                }

                if($scope.items == '' && $scope.name.length > 2){
                    //console.log('make get Request');
                    $http({
                        url: '/search',
                        method: 'POST',
                        data: $scope.name,
                        // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                    }).success(function(response) {
                        //console.log(response);
                        $scope.items = response.search_details;
                    });   
                }
            })
        },100);
    }

    $scope.onSearchItemSelected=function(val){
        //console.log('selected='+$scope.name + ' - ' + val);
        $scope.items = '';
        $location.path("/user/"+val);
    }

    $scope.hideSearchResults = function() {
        $scope.items = '';
    }

}]);
