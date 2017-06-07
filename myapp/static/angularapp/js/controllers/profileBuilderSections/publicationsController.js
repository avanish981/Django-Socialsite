// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.directive('ngReallyClickPublications', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(scope.profileInfo_Publications.publications[scope.CurrentEditIndex].authors.length == 1){
                    var message = attrs.ngReallyMessage;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.ngReallyClickPublications);
                    }
                }
                else {
                    scope.$apply(attrs.ngReallyClickPublications);
                }
            });
        }
    }
}]);

mySocialElite.controller('publicationsController', ['$scope', '$http', 'fileUpload', 'myservice', 
	function($scope, $http, fileUpload, myservice){
		
        $scope.CurrentEditIndex = '';
		$scope.data = "publications controller";

		$scope.publicationNew = {
            "title":"",
            "publication_publisher":"",
            "date":"",
            "publication_url":"",
            "description":"",
            "authors":[{"name":"", "profileUrl":""},]
		};

    	$scope.getProfileInfoPublications = function(){
            $http({
                url: '/publication',
                method: 'GET',
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.profileInfo_Publications = { 
                                                    "visibility" : true,
                                                    "title": "Publications",
                                                    "publications": response.publications
                                                }
            });
        };

    $scope.getProfileInfoPublications();
	
    $scope.addNewAuthorRow = function() {
        var temp = { "name":"", "profileUrl":""};
        $scope.publicationNew.authors.push(temp);
    }

    $scope.addNewAuthorRowEditMode = function(idx) {
        var temp = { "name":"", "profileUrl":""};
        $scope.profileInfo_Publications.publications[idx].authors.push(temp);
        //console.log($scope.profileInfo_Publications.publications[idx].authors);
    }

    $scope.addNewPublication = function() {
        setTimeout(function(){
            //console.log('Adding new Publication');
            $scope.$apply(function(){
                //console.log($scope.publicationNew)

                //Https POST Call goes here: In the successful return clear the model contents ()
                $http({
                    url: '/publication',
                    method: 'POST',
                    data: $scope.publicationNew,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function(response) {
                    $scope.publicationNew = {};
                    //console.log(response);
                    $scope.getProfileInfoPublications();
                });
                // Reload the values
            })
        }, 10);

    }

    $scope.updatePublication = function(idx) {
        setTimeout(function(){
            //console.log('Updated Publication is: ' + idx)
            //console.log($scope.profileInfo_Publications.publications)

            $http({
                url: '/publication',
                method: 'PUT',
                data: {"index":idx,"updatePublication":$scope.profileInfo_Publications.publications[idx]},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                $scope.getProfileInfoPublications();
            });
        }, 10);
    };

    $scope.setEditPublicationIndex = function(idx, flag) {
        if (flag ==  1) {
            $scope.CurrentEditIndex = idx;
        }
        else {
            $scope.CurrentEditIndex = '';   
        }
    }


    $scope.removeAuthors = function(idx) {
        $scope.profileInfo_Publications.publications[$scope.CurrentEditIndex].authors.splice(idx, 1);
    }

    $scope.removeNewAuthors = function(idx) {
        $scope.publicationNew.authors.splice(idx, 1);
    }

    $scope.deletePublications = function(idx) {
        //console.log('Deleting Publication at index : ' + idx + '!');
        $http({
                url: '/publication',
                method: 'DELETE',
                data: {"index":idx},
                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(response) {
                //console.log(response);
                // Reload the values
                $scope.getProfileInfoPublications();
            });
    }

    $scope.reset = function() {
        $scope.publicationNew.title =  "";
        $scope.publicationNew.publication_publisher =  "";
        $scope.publicationNew.date =  "";
        $scope.publicationNew.publication_url =  "";
        $scope.publicationNew.description =  "";
        $scope.publicationNew.authors = [{"name":"", "profileUrl":""}]
    }

    $scope.discardPublication = function() {
        $scope.reset();
    };

/*	$scope.profileInfo_Publications = { 
        "visibility" : true,
        "title": "Publications",
        "publications": [
            {
                "title":"Performance Evaluation of Edge-based Video Error Concealment using H.264 Flexible Macroblock Ordering",
                "publication_publisher":"International Journal of Computer Science and Engineering Technology",
                "date":"December 2012",
                "publication_url":"http://www.ijcset.com/docs/IJCSET12-03-12-014.pdf#!",
                "description":"This paper evaluates the directional interpolation scheme used widely for spatial error concealment in the H.264/AVC video coding standard using Flexible Macroblock Ordering (FMO). "
                                +"A mathematical analysis of FMO is presented to illustrate its effectiveness as an error resilience tool." 
                                +"Compared to the weighted pixel interpolation scheme of the test model, the directional interpolation "
                                +"scheme gives a relatively improved error concealment performance, since it preserves the edge direction of the damaged area by using the information from correctly received neighboring regions. However, the effectiveness of this technique depends on the method used for determining the dominant edge direction for the damaged area. Two methods are discussed, and simulations are conducted to test their performance for varied video content. Also, a variation of the commonly used PSNR quality metric is defined to obtain true performance results based on Jensen’s inequality.",
                "authors":[
                            {"name":"Saurabh Mistry", "profileUrl":""},
                            {"name":"Sannidhi Dixit", "profileUrl":""},
                            {"name":"Santosh Chapaneri", "profileUrl":""},
                ]
            },
        ]
    };*/


}]);