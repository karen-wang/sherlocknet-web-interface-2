'use strict';

// Register `phoneDetail` component, along with its associated controller and template
angular.
module('phoneDetail').
component('phoneDetail', {
    templateUrl: 'phone-detail/phone-detail.template.html',
    controller: ['$scope', '$routeParams', 'Phone', '$sce', '$http', '$log',
        function PhoneDetailController($scope, $routeParams, Phone, $sce, $http, $log) {
            this.scope_ = $scope;
            AWS.config.update({
                accessKeyId: 'AKIAJBBXGRQWTZT7YZ5Q',
                secretAccessKey: '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'
            });
            AWS.config.region = 'us-west-2';
            var db = new AWS.DynamoDB();

            var apiKey = '56ec2f8adce9c3ef47980bb5f3572608';

            $http.get('https://api.flickr.com/services/rest/' +
                '?method=flickr.photos.getInfo' +
                '&api_key=' + apiKey +
                '&photo_id=' + $routeParams.phoneId +
                '&format=json&nojsoncallback=1').then((response) => {
                $log.debug(response);
                this.photo = response.data.photo;
                this.url = convertToURl(this.photo.farm, this.photo.server, this.photo.id, this.photo.secret);
                this.titleHTML = $sce.trustAsHtml(this.photo.title._content);
                this.descHTML = $sce.trustAsHtml(this.photo.description._content);
                this.tags = this.photo.tags.tag;
                this.photoPage = this.photo.urls.url[0]._content;
                $log.debug(this.photoPage);
                //$log.debug(this.tags);
            });


            var key = $routeParams.phoneId;
            
            var captionTable = new AWS.DynamoDB({
                params: {
                    TableName: 'SherlockNetCaptions'
                }
            });
            captionTable.getItem({
                Key: {
                    ImageID: {
                        S: key
                    }
                }
            }, (err, data) => {
              if (data.Item) {
                this.caption = data.Item.Caption.S;
              }
            });

            var relatedImgTable = new AWS.DynamoDB({
                params: {
                    TableName: 'SherlockNet'
                }
            });

            this.relatedImgs = [];

            relatedImgTable.getItem({
                Key: {
                    ImageID: {
                        S: key
                    }
                }
            }, (err, data) => {
                //$log.debug(this);
                $log.debug(data.Item); // print the item data
                if (data.Item) {
                    let imgList = data.Item.RelatedImages.L;
                    // $log.debug(this.relatedImgs);
                    // $log.debug(this.relatedImgs[0].S);

                    for (let k in imgList) {
                        if (imgList.hasOwnProperty(k)) {
                            //$log.debug(k + " -> " + imgList[k].S);
                            let imgID = imgList[k].S;


                            $http.get('https://api.flickr.com/services/rest/' +
                                '?method=flickr.photos.getInfo' +
                                '&api_key=' + apiKey +
                                '&photo_id=' + imgID +
                                '&format=json&nojsoncallback=1').then((response) => {
                                let photoData = response.data.photo;
                                // $log.debug(photoData);
                                let photoURL = convertToURl(photoData.farm, photoData.server, imgID, photoData.secret, 'small_square');
                                //$log.debug(photoURL);

                                let imgObj = {
                                    'id': imgID,
                                    'url': photoURL
                                };

                                this.relatedImgs.push(imgObj);
                            });

                        }
                    }
                }
            });

        }
    ]
});

function convertToURl(farmID, serverID, ID, secret, size) {
    var URL = 'https://farm' +
        farmID +
        '.staticflickr.com/' +
        serverID +
        '/' +
        ID +
        '_' +
        secret;
    if (size) {
        if (size === 'small_square') {
            URL += '_s';
        }
    }
    URL += '.jpg';
    return URL
}