angular.module('commentServices',[])
.factory('Comment', function($http){
  commentFactory = {};

// Gallery.readPhotoData(user_id)
  commentFactory.createComment = function(commentData){
    return $http.post('/api/comment',commentData);
  };

  commentFactory.readComment = function(photo_id){
    return $http.get('/api/comment/'+photo_id);
  };

  commentFactory.readBoardComment = function(board_id){
    return $http.get('/api/commentBoard/'+board_id);
  };

  return commentFactory;
});
