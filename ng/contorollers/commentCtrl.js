angular.module('commentControllers',['commentServices'])
.controller('commentCtrl', function ($scope, $http, $stateParams, $state, $window, Comment) {
  // id에 해당하는 값을 보여주는 함수
  // 값을 가져오는 함수
  var app = this;
  $scope.userComment = false;

  // 코멘트 생성하기
    this.createComment = function(response){
        $http.post('/api/comment', app.response).then(function(data){
          console.log(data);
        });
      // if(valid){
      //   Comment.createComment(app.response).then(function(data){
      //
      //
      //   });
      // } else {
      //   app.errorMsg = '';
      // }
      // if(valid){
      //   var board_id = response.board_id;
      //   var photo_id = response.photo_id;
      //   var comment  = response.comment;
      //    $http.post('/api/comment', {
      //      board_id: board_id, photo_id: photo_id, comment: comment
      //    }).then(function(response){
      //      $state.reload();
      //    });
      // } else {
      //   $window.alert("댓글을 입력해주세요.");
      // }

    };







  $scope.getComment = function(){
    var photo_id = $stateParams.photo_id;
    var board_id = $stateParams.board_id;
    var id = "";

    var data = {
      photo_id:photo_id,
      board_id:board_id
    };

    var config = {
      params: data,
      headers : {'Accept' : 'application/json'}
    };

    if(photo_id){
      id = photo_id;
      $http.get('/api/comment/'+id, config).then(function(response){
        $scope.comments = response.data[0];
      });
    }
    else if(board_id){
      id = board_id;
      $http.get('/api/comment/'+id, config).then(function(response){
        $scope.comments = response.data[0];
      });
    } else {
        $scope.comments = '시스템이 불안정합니다.';
    }
  };

  // 코멘트 생성하기
    $scope.addComment = function(response, valid){
      if(valid){
        var board_id = response.board_id;
        var photo_id = response.photo_id;
        var comment  = response.comment;
         $http.post('/api/comment', {
           board_id: board_id, photo_id: photo_id, comment: comment
         }).then(function(response){
           $state.reload();
         });
      } else {
        $window.alert("댓글을 입력해주세요.");
      }

    };


  // 값을 삭제하는 함수
  $scope.deleteComment = function(response){
    var id = response.comment_id;
  	$http.delete('/api/comment/'+id).then(function(response){
      $state.reload();
  	});
  };
});
