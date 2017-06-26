angular.module('app')
.controller('BoardController', function ( $scope, $location, $http, $stateParams) {

  $scope.data = {
   availableOptions: [
     {id: '-1', name: '카테고리를 선택해주세요.'},
     {id: '0', name: '공지사항'},
     {id: '1', name: '학원/홍보'},
     {id: '2', name: '모임/스터디'}
   ],
   selectedOption: {id: '-1', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
   };

  // id에 해당하는 값을 보여주는 함수
  $scope.userArticle = false;

// 값을 저장하는 함수
  $scope.addBoard = function(title, content){
// employess 제대로 동작하는지 확인 필요
      var board_type = $scope.data.selectedOption.id;
      $http.post('api/boardMenu',
      { title:title, content: content, board_type: board_type})
      .then(function(response){          // 정상 작동하였습니다.
      });
      $location.path('app.board');
  };

	$scope.showBoard = function(){
  // 보드 아이디 전송
  var id = $stateParams.board_id;
    $http.get('api/board/'+id).then(function(response){
// 사용자가 작성한 게시물입니다.
    if(response.data[1].success){
      $scope.userArticle = true;
      $scope.board = response.data[0][0];
    }
// 사용자가 작성한 게시물이 아닙니다.
    else {
      $scope.userArticle = false;
      $scope.board = response.data[0][0];
    }
  });
};


  // 값을 삭제하는 함수
	$scope.deleteBoard = function(){
    var id = $stateParams.board_id;
		$http.delete('api/board/'+id).then(function(response){
        $location.path('app.board.category({code: 0})');
		});
	};

  	// 값을 수정하는 함수
  	$scope.updateBoard = function(){
  		var id = $stateParams.board_id;
  		$http.put('api/board/'+id , $scope.board).then(function(response){
  			$scope.board = response.data;
        $location.path('board');
  		});
  	};

});
