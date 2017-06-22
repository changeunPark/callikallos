angular.module('app')
.controller('ArtistMenuController', function ($scope, $http, $stateParams) {

  // define list of items 전체 데이터 정렬
      $scope.data = {
       availableOptions: [
         {sort: '-created', name: '최신순'}
       ],
       selectedOption:  {sort: '-created', name: '최신순'} //This sets the default value of the select in the ui
       };

// 전체 메뉴 가져오기
    $http.get('/api/artistMenu').then(function(response){
      $scope.headers = response.data;
    });

// 선택한 코드에 따른 작가 불러오기
    $scope.getHeaderContent = function(){
      var code = $stateParams.code;
      $http.get('/api/artistMenu/'+code).then(function(response){
        console.log(response);
            var i;
            for(i = 0; i<response.data.length;i++){
              if(response.data[i].user_type === 0){
                  response.data[i].description = '미분류';
              }
            }
            $scope.allArtist = response.data;
      });

    };
});
