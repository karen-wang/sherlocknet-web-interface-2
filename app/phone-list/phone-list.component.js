'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
module('phoneList').
component('phoneList', {
    templateUrl: 'phone-list/phone-list.template.html',
    controller: ['Phone', '$http', '$routeParams', '$location', '$scope', '$uibModal', '$log',
        function PhoneListController(Phone, $http, $routeParams, $location, $scope, $uibModal, $log) {
            // this.simpleInput = '';
            // this.disableButtons = this.simpleInput.split(',').length > 1;
            this.currentNavItem = 'home';
            this.disableSuggestSyns = false;
            this.query = $routeParams.query;
            this.orderProp = $routeParams.order;
            this.pageNum = parseInt($routeParams.pageNum);
            this.disableNext = false;
            this.maxPageNum
            this.getImgUrl = (photo) => {
                // See: https://www.flickr.com/services/api/misc.urls.html
                return 'https://farm' +
                    photo.farm +
                    '.staticflickr.com/' +
                    photo.server + '/' +
                    photo.id +
                    '_' +
                    photo.secret +
                    '_q.jpg'
            };
            this.submitQuery = () => {
                $log.debug('submit query');

                if (this.simpleInput) {
                  var tags = this.simpleInput.split(",");
                  tags.forEach(function(str, ix, arr) { arr[ix] = str.trim(); });
                  var machineTags = [];
                  tags.forEach(function(str) { 
                    machineTags.push('sherlocknet:*=\"' + str + '\"');
                  });
                  // tags = tags.concat(sherlockTags);
                  $log.debug(tags);
                  this.query = '&tag_mode=any&machine_tags=' + machineTags.join('%2C+');
                  // this.query += '&machine_tags=' + machineTags.join('%2C+');
                  this.simpleInput = ''; //reset user input
                  $location.path("images/page/1/sortby/" + this.orderProp + "/query/" + this.query);
                } else {
                    $location.path("images/page/1/sortby/" + this.orderProp + "/query");
                }
            };

            this.suggestSynonyms = () => {
                $log.debug(this.simpleInput);
                if (!this.simpleInput) {
                    return;
                }
                let word = this.simpleInput.trim();
                let endpoint = 'https://wordsapiv1.p.mashape.com/words/' + word + '/synonyms';
                $http.get(endpoint, {
                        headers: {
                            'X-Mashape-Authorization': 'XcWTGi5HAtmshmFAApdNXQgfpAKmp1tdmPVjsnHDqtFR9EdQya'
                        }
                    })
                    .then((response) => {
                        $log.debug(response);
                        let synList = response.data.synonyms;
                        $log.debug(synList);
                        if (synList) {
                            synList = synList.slice(1, 8); // only get first 8 synonyms
                            this.simpleInput += ', ' + synList.join(', ');
                        }

                    });

            };

            let request = 'https://api.flickr.com/services/rest/' +
                '?method=flickr.photos.search' +
                '&api_key=56ec2f8adce9c3ef47980bb5f3572608' +
                '&user_id=12403504%40N02' +
                '&page=' + this.pageNum +
                '&sort=' + this.orderProp +
                '&per_page=40' +
                '&format=json&nojsoncallback=1' +
                this.query;
                // this.tagsField +
                // '&tag_mode=any';
            $log.debug(request);
            $http.get(request).then((response) => {
                if (!response || !response.data || !response.data.photos || !response.data.photos.photo) {
                    return;
                }
                var phones = response.data.photos.photo;
                this.maxPageNum = parseInt(response.data.photos.pages);
                var numResults = response.data.photos.total;
                $log.debug('num results: ' + numResults);

                if (numResults < 1) { //try to re-query if no results are found
                  $log.debug('re-querying one more time');
                  $http.get(request).then((response) => {
                      if (!response || !response.data || !response.data.photos || !response.data.photos.photo) {
                          return;
                      }
                      var phones = response.data.photos.photo;
                      this.maxPageNum = parseInt(response.data.photos.pages);
                      var numResults = response.data.photos.total;
                      $log.debug('num results: ' + numResults);
                      $log.debug('max page num for %s is %s', this.query, this.maxPageNum);
                      if (this.pageNum >= this.maxPageNum) {
                          $log.debug('page num %s, max %s', this.pageNum, this.maxPageNum);
                          this.disableNext = true;
                      }
                      // $log.debug(phones.length);
                      this.phones = phones;
                  });
                }

                else {
                  $log.debug('max page num for %s is %s', this.query, this.maxPageNum);
                  if (this.pageNum >= this.maxPageNum) {
                      $log.debug('page num %s, max %s', this.pageNum, this.maxPageNum);
                      this.disableNext = true;
                  }
                  // $log.debug(phones.length);
                  this.phones = phones;
                }
            });
        }
    ]
}).directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
}).directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]);