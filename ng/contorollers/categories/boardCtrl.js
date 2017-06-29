angular.module('boardControllers',['boardServices'])
.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])

.controller('boardTapCtrl', function(Board, $scope){
  var app = this;
  Board.readBoardTap().then(function(data){
    $scope.headers = data.data;
  });
})
.controller('boardsCtrl', function($stateParams, Board){
  var app = this;
  var board_type = $stateParams.code;

  app.data = {
   availableOptions: [
     {sort: '-created', name: '최신순'},
     {sort: '-view', name: '조회순'},
     {sort: '-comment_count', name:'댓글순'}
   ],
   selectedOption:  {sort: '-created', name: '최신순'} //This sets the default value of the select in the ui
   };

   Board.readBoards(board_type).then(function(data){
     app.boardDatas = data.data.result;

   });
})

.controller('boardCtrl', function($stateParams, Board, $scope, $http, $state, $timeout){
    // 보드 아이디 전송
    var app = this;
    app.data = {
     availableOptions: [
       {id: '0', name: '카테고리를 선택해주세요.'},
       {id: '1', name: '공지사항'},
       {id: '2', name: '잡학사전'},
       {id: '3', name: '질문사항'}
     ],
     selectedOption: {id: '0', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
     };

    $(document).ready(function() {

      $('#summernote').summernote({
        lang: 'ko-KR', // default: 'en-US'
        height : 100, // 에디터의 높이
        minHeight : null,
        maxHeight : null,
        focus : true,
        placeholder: '댓글은 1,000자까지 작성할 수 있으며 주제와 무관한 댓글, 악성 댓글은 삭제될 수 있습니다.',
        toolbar: [
  // [groupName, [list of button]]
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['strikethrough', 'superscript', 'subscript']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']]
        ]
      });
    });

    this.createBoard = function(response){
      app.disabled = true;
      app.errorMsg = false;
        if(app.data.selectedOption.id === '0'){
          app.errorMsg = '게시글의 종류를 선택해주세요';
          app.disabled = false;
        } else if(response === undefined || response === null || response === ''){
          app.errorMsg = '제목을 입력해주세요.';
          app.disabled = false;
        } else if($('#summernote').summernote('code') === '<p><br></p>' || $('#summernote').summernote('code') === null || $('#summernote').summernote('code') === undefined || $('#summernote').summernote('code') === '') {
          app.errorMsg = '내용을 입력해주세요.';
          app.disabled = false;
        } else {
          var content = $('#summernote').summernote('code');
          var board_type = app.data.selectedOption.id;
          var title = response.title;
          var boardData = {
            title : title,
            content : content,
            board_type : board_type,
            user_id : $scope.main.user.user_id
          };
          Board.createBoard(boardData).then(function(data){
            if(data.data.success){
              app.successMsg = data.data.message;
              $timeout(function(){
                $state.go('app.board');
              },500);
            } else {
              app.disabled = false;
              app.errorMsg = data.data.message;
            }
          });

        }
    };


    var board_id = $stateParams.board_id;
    Board.readBoard(board_id).then(function(data){
      if(data.data.success){
        app.boardDatas = data.data.result;
        app.htmlcontent = data.data.result.content;
      } else {
        app.errorMsg = data.data.message;
      }
    });





//
//   $scope.data = {
//    availableOptions: [
//      {id: '-1', name: '카테고리를 선택해주세요.'},
//      {id: '0', name: '공지사항'},
//      {id: '1', name: '학원/홍보'},
//      {id: '2', name: '모임/스터디'}
//    ],
//    selectedOption: {id: '-1', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
//    };
//
//   // id에 해당하는 값을 보여주는 함수
//   $scope.userArticle = false;
//
// // 값을 저장하는 함수
//   $scope.addBoard = function(title, content){
// // employess 제대로 동작하는지 확인 필요
//       var board_type = $scope.data.selectedOption.id;
//       $http.post('api/boardMenu',
//       { title:title, content: content, board_type: board_type})
//       .then(function(response){          // 정상 작동하였습니다.
//       });
//   };
//
// 	$scope.showBoard = function(){
//   // 보드 아이디 전송
//   var id = $stateParams.board_id;
//     $http.get('api/board/'+id).then(function(response){
// // 사용자가 작성한 게시물입니다.
//     if(response.data[1].success){
//       $scope.userArticle = true;
//       $scope.board = response.data[0][0];
//     }
// // 사용자가 작성한 게시물이 아닙니다.
//     else {
//       $scope.userArticle = false;
//       $scope.board = response.data[0][0];
//     }
//   });
// };
//
//
//   // 값을 삭제하는 함수
// 	$scope.deleteBoard = function(){
//     var id = $stateParams.board_id;
// 		$http.delete('api/board/'+id).then(function(response){
//         $location.path('app.board.category({code: 0})');
// 		});
// 	};
//
//   	// 값을 수정하는 함수
//   	$scope.updateBoard = function(){
//   		var id = $stateParams.board_id;
//   		$http.put('api/board/'+id , $scope.board).then(function(response){
//   			$scope.board = response.data;
//         $location.path('board');
//   		});
//   	};
});
