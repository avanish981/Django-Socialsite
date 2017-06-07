// create the controller and inject Angular's $scope    
// var mySocialElite = angular.module('RoutingApp');
var mySocialElite = angular.module('RoutingApp');  

mySocialElite.controller('callbackGoogleController', ['$scope', '$location','$http','myservice', function($scope, $location, $http, myservice) {
    
    
    $scope.myservice = myservice;

    /*console.log('Received a callback Response - Google');*/
    // Make GET Request and process this to get the query parameters
    var callbackResponse = (decodeURIComponent(document.URL)).split("?")[1];
    /*console.log(callbackResponse);*/

    var responseParameters = (callbackResponse).split("&");
    var parameterMap = [];
    for(var i = 0; i < responseParameters.length; i++) {
        parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
    }

    /*console.log(parameterMap.state)
    console.log(parameterMap.code)
    console.log(parameterMap.error)
    console.log(parameterMap.error_description)*/

    if(parameterMap.error !== undefined &&  parameterMap.error_description != undefined) {
        alert("An Error Occured: " + parameterMap.error + "-" + parameterMap.error_description);
        window.location.href = "https://localhost:8000/";
    }

    if(parameterMap.state === '987654321') {
        /*console.log('State Verified - Google');*/

    //    var id_token = googleUser.getAuthResponse().id_token;
    //      console.log("ID Token: " + id_token);

        /*console.log('Before Http Post')*/
        $http({
            url: 'https://localhost:8000/google_login',
            method: 'POST',
            data: {"code":parameterMap.code},
        }).success(function(response) {
                /*console.log(response);
                console.log(response.lastname);*/
                success_message = response.success+" "+response.username;
                /*alert(success_message);*/
                myservice.user.firstname = response.firstname;
                myservice.user.lastname = response.lastname;
                myservice.user.email = response.email;
                myservice.user.image = response.user_photo;
                myservice.user.alldetails = response.alldetails;
                myservice.loggedIn = true;
                $location.path("/profile");
        });

    }

    else {
        alert("Problem authenticating: Http Error Code 401: Unauthorized!");
    }
}]);
