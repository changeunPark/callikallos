angular.module('app')
.controller('OpinionController', function ( $scope, $http, $stateParams) {

// 좋아요 가져오기
// 댓글 개수 가져오기
$scope.doLikeStatus = true;
   $scope.doLike = function(){
     $scope.doLikeStatus = !$scope.doLikeStatus;
   };


// 게시판에 해당하는 댓글 및 좋아요 가져오기
  $scope.getOpinion = function(response){
    		var id = $stateParams.id;
    $http.get('/api/opinion/'+id).then(function(response){
      $scope.opinionInfo = response.data[0][0];
    });
  };

  // $scope.addLike = function(){
  //   $scope.likeStatus = !$scope.likeStatus;
  //   if($scope.likeStatus){
  //     console.log('사용자가 좋아요를 취소합니다.');
  //     var id = $stateParams.id;
  //     $http.delete('/api/opinion/'+id,{
  //         board_id:id
  //     }).then(function(response){
  //               $state.reload();
  //     });
  //   }else {
  //     console.log('사용자가 좋아요를 눌렀습니다.');
  //     var board_id = $stateParams.id;
  //     $http.post('/api/opinion/',{
  //         board_id:board_id
  //     }).then(function(response){
  //         $state.reload();
  //     });
  //   }
  // };

});
