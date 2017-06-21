angular.module('app')
.controller('MainMenuController', function ($http, $scope) {
  $http.get('/api/header').then(function(response){
    $scope.headers = response.data;
  });
});
