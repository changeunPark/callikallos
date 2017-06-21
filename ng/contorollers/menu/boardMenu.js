angular.module('app')
.controller('BoardMenuController', function ($scope,$http, $stateParams) {

// define list of items 전체 데이터 정렬
        $scope.data = {
         availableOptions: [
           {sort: '-created', name: '최신순'},
           {sort: '-view', name: '조회순'},
           {sort: '-comment_count', name:'댓글순'}
         ],
         selectedOption:  {sort: '-created', name: '최신순'} //This sets the default value of the select in the ui
         };


// 전체 메뉴 가져오기
    $http.get('/api/boardMenu').then(function(response){
      $scope.headers = response.data;
    });

// 선택한 코드에 따른 결과 값 가져오기
      $scope.getHeaderContent = function(){
        var code = $stateParams.code;
        $http.get('/api/boardMenu/'+code).then(function(response){
          $scope.boardes = response.data;
        });
      };
});
