angular.module('boardServices',[])
.factory('Board', function($http){
  boardFactory = {};

  boardFactory.readBoardTap = function(){
    return $http.get('/api/boardMenu');
  };

  boardFactory.readBoards = function(board_type){
    return $http.get('/api/boardMenu/'+board_type);
  };

  boardFactory.readBoard = function(board_id){
    return $http.get('api/board/'+board_id);
  };


  return boardFactory;
});
