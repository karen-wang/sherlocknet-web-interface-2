'use strict';

// Register `phoneAbout` component, along with its associated controller and template
angular.
module('phoneAbout').
component('phoneAbout', {
  templateUrl: 'phone-about/phone-about.template.html',
  controller: ['$scope', '$routeParams', '$log',
  function PhoneAboutController($scope, $routeParams, $log) {
    $log.debug('about page');
    this.currentNavItem = 'about';

    }
    ]
  });
