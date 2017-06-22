angular.module('app')
.controller('displayMenuController', function ( $scope, $http, $stateParams) {

// define list of items 전체 데이터 정렬
    $scope.data = {
     availableOptions: [
       {sort: '-created', name: '최신순'}
     ],
     selectedOption:  {sort: '-created', name: '최신순'} //This sets the default value of the select in the ui
     };

    $http.get('/api/displayMenu').then(function(response){
      $scope.headers = response.data;
    });


// 선택한 코드에 따른 이미지 가져오기
    $scope.getHeaderContent = function(){
      var code = $stateParams.code;
      $http.get('/api/displayMenu/'+code).then(function(response){
        $scope.displays = response.data;
      });
    };

});
