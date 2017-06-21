angular.module('app')
.controller('ArtistController', function ($scope, $http, $stateParams) {
  $scope.getArtist = function() {
  var id = $stateParams.artist_id;
  $http.get('/api/artist/'+id).then(function(response){
    $scope.artistInfo = response.data;
    });
  };
});
