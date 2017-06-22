angular.module('app').controller('PhotosController', function ($scope, $http) {
    $scope.getArtist = function() {
      $http.get('/api/myPhotos/').then(function(response){
        $scope.artistInfo = response.data;
      });
    };
});
