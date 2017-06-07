// create the controller and inject Angular's $scope    
var mySocialElite = angular.module('RoutingApp');

mySocialElite.service('calendarBlock', function() {
  this.data = {'start' : '12/12/12'};
});

mySocialElite.factory('alert', function($uibModal, $rootScope, $http, userInfoSectionVisibility) {

  function showEvent(action, event) {
    return $uibModal.open({
      templateUrl: 'static/angularapp/html/calendarControls/showEventTemplate.html',
      controller: function() {
        var vm = this;
        vm.action = action;
        vm.eventDetails = event;

        vm.openEditor = function(){
          $rootScope.$broadcast('openEvenEditor', vm.eventDetails );
        }
      },
      controllerAs: 'vm'
    });
  };

  function showEventEditor(action, event) {
    return $uibModal.open({
      templateUrl: 'static/angularapp/html/calendarControls/showEventEditorTemplate.html',
      controller: function() {
        var vm = this;
        vm.action = action;
        vm.eventDetails = event;
        vm.eventDetails.startsAt = new Date(vm.eventDetails.startsAt);
        vm.eventDetails.endsAt = new Date(vm.eventDetails.endsAt);

        vm.deleteExistingEvent = function() {
          //console.log('Delete:');
          //console.log(vm.eventDetails);
          $http({
            url: '/calender',
            method: 'DELETE',
            data: {'eventDetails':vm.eventDetails,'emailId':userInfoSectionVisibility.searchForUser['emailId']}
          }).success(function(response) {
              //console.log(response);
            });
          $rootScope.$broadcast('eventDataModified');
        }

        vm.discardChanges = function(){
          $rootScope.$broadcast('eventDataModified');
        }

        vm.saveExistingEvent = function() {
          //console.log('Re-Save:');
          //console.log(vm.eventDetails);
          $http({
            url: '/calender',
            method: 'PUT',
            data: {'eventDetails':vm.eventDetails,'emailId':userInfoSectionVisibility.searchForUser['emailId'],'timeOffsetStart':vm.eventDetails.startsAt.getTimezoneOffset(),'timeOffsetEnd':vm.eventDetails.endsAt.getTimezoneOffset()},
          }).success(function(response) {
              //console.log(response);
              /*$scope.getCalendarExtent();*/
            });
          $rootScope.$broadcast('eventDataModified');
        }

        vm.toggle = function($event, field, event) {
          $event.preventDefault();
          $event.stopPropagation();
          event[field] = !event[field];
        };

      },
      controllerAs: 'vm'
    });
  };

  function showEventDeleteBox(action, event) {
    return $uibModal.open({
      templateUrl: 'static/angularapp/html/calendarControls/showEventDeleteBoxTemplate.html',
      controller: function() {
        var vm = this;
        vm.action = action;
        vm.eventDetails = event;

        vm.deleteExistingEvent = function() {
          //console.log('Delete:');
          //console.log(vm.eventDetails);
          $http({
            url: '/calender',
            method: 'DELETE',
            data: {'eventDetails':vm.eventDetails,'emailId':userInfoSectionVisibility.searchForUser['emailId']}
          }).success(function(response) {
              //console.log(response);
            });
          $rootScope.$broadcast('eventDataModified');
        }

      },
      controllerAs: 'vm'
    });
  };

  return {
    showEvent : showEvent,
    showEventEditor : showEventEditor,
    showEventDeleteBox : showEventDeleteBox
  };

});


mySocialElite.controller('userCalendarController', function($scope, moment, alert, calendarBlock, $http, userInfoSectionVisibility) {

    var vm = this;

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    vm.events = [
      {
        title: 'Test Event',
        type: 'info',
        startsAt: new Date(2016,6,26,13,0,0),
        endsAt: new Date(2016,6,29,16,0,0),
        description:'Test Description',
        draggable: true,
        resizable: true
      }
    ];

    vm.calNewEvent = {
      title: '',
      type: 'info',
      startsAt: '',
      endsAt: '',
      description: '',
      draggable: true,
      resizable: true
    };

    vm.discardNewEvent =function(){
      vm.resetNewEvent();
    }

    vm.saveNewEvent =function(){
      //console.log("New Event is:");
      //console.log(vm.calNewEvent);
      $http({
        url: '/calender',
        method: 'POST',
        data: {'eventDetails':vm.calNewEvent,'emailId':userInfoSectionVisibility.searchForUser['emailId'],'timeOffsetStart':vm.calNewEvent.startsAt.getTimezoneOffset(),'timeOffsetEnd':vm.calNewEvent.endsAt.getTimezoneOffset()},
      }).success(function(response) {
          //console.log(response);
          vm.resetNewEvent();
          $scope.getCalendarExtent();
        });
    }

    vm.resetNewEvent = function() {
      vm.calNewEvent = {
        title: '',
        type: 'info',
        startsAt: '',
        endsAt: '',
        description: '',
        draggable: true,
        resizable: true
      };
    };

    vm.isCellOpen = true;

    vm.eventClicked = function(event) {
      alert.showEvent('Clicked', event);
    };

    vm.eventEdited = function(event) {
      alert.showEventEditor('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.showEventDeleteBox('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      alert.showEventEditor('Dropped or resized', event);
    };

    $scope.$on('eventDataModified', function () {
        //console.log('Refresh and Get Event Details');
        $scope.getCalendarExtent();
    });

    $scope.$on('openEvenEditor', function() {
        //console.log('Open Editor');
        //console.log(event);
        //console.log(data);
        alert.showEventEditor('Edited', data);
    })

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    $scope.getCalendarExtent = function() {
      var startDay = '';
      var endDay = '';
      if(vm.calendarView == 'month') {
        var date = new Date(vm.viewDate), y = date.getFullYear(), m = date.getMonth();
        startDay = new Date(y, m, 1,0,0,0);
        endDay = new Date(y, m + 1, 0,23,59,59);
      }
      else if(vm.calendarView == 'week'){
        var curr = new Date(vm.viewDate);
        var date = new Date(curr.setDate(curr.getDate() - curr.getDay()));
        var y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        startDay = new Date(y,m,d,0,0,0);
        date = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
        y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        endDay = new Date(y,m,d,23,59,59);
      }
      else if(vm.calendarView == 'day'){
        var date = new Date(vm.viewDate);
        //var date = new Date(curr.setDate(curr.getDate() - curr.getDay()));
        var y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        startDay = new Date(y,m,d,0,0,0);
        endDay = new Date(y,m,d,23,59,59);
      }


      //console.log('Start: '+startDay);
      //console.log('End: '+endDay);
      /*console.log(userInfoSectionVisibility.searchForUser);*/
      $http({
        url: '/calender',
        method: 'GET',
        params: {'startDay':startDay,'endDay':endDay,'emailId':userInfoSectionVisibility.searchForUser['emailId']},
      }).success(function(response) {
          //console.log(response.calender_events);
          vm.events = response.calender_events
        });
    }

    $scope.getCalendarExtent();

    $scope.data = calendarBlock.data;

  });
