angular.module('app')
.controller('HomeCtrl', function ( $http, $scope) {

  $scope.getContent = function(){
    $http.get('/api/home').then(function(response){
      $scope.photos = response.data;
    });
  };

});
