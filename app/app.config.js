'use strict';

angular.
  module('phonecatApp').
  config(['$locationProvider' ,'$routeProvider', '$logProvider',
    function config($locationProvider, $routeProvider, $logProvider) {
      $logProvider.debugEnabled(false);

      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/images/page/:pageNum/sortby/:order/query/:query?', {
          template: '<phone-list></phone-list>'
        }).
        when('/images/detail/:phoneId', {
          template: '<phone-detail></phone-detail>'
        }).
        when('/about', {
          template: '<phone-about></phone-about>'
        }).
        when('/advanced', {
          template: '<phone-adv></phone-adv>'
        }).
        otherwise('/images/page/1/sortby/relevance/query/');
    }
  ]);
