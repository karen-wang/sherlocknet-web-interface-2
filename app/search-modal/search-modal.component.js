'use strict';

// Register `searchModal` component, along with its associated controller and template
angular.
module('searchModal').
component('searchModal', {
  templateUrl: 'search-modal/search-modal.template.html',
  controller: ['$scope', '$routeParams',
  function SearchModalController($scope, $routeParams) {
    console.log('search modal');

    }
    ]
  });


