'use strict';

// Register `phoneAdv` component, along with its associated controller and template
angular.
module('phoneAdv').
component('phoneAdv', {
  templateUrl: 'phone-adv/phone-adv.template.html',
  controller: ['$scope', '$routeParams', '$location', '$log',
  function PhoneAdvController($scope, $routeParams, $location, $log) {
    $log.debug('advanced search page');
    this.tagMode = 'any';
    this.machineTagMode = 'any';
    this.submitAdvSearch = function() {
    	this.query = '';

    	if (this.tags) {
    		var tags = this.tags.split(",");
    		tags.forEach(function(str, ix, arr) { arr[ix] = str.trim(); });
    		this.query += '&tag_mode=' + this.tagMode + '&tags=' + tags.join('%2C+');
    	}
    	if (this.machineTags) {
    		var machineTags = this.machineTags.split(",");
    		machineTags.forEach(function(str, ix, arr) { arr[ix] = str.trim(); });
    		this.query += '&machine_tag_mode=' + this.machineTagMode + '&tags=' + machineTags.join('%2C+');
    	}
    	$location.path("images/page/1/sortby/relevance/query/" + this.query);
    }
    }
    ]
  });
