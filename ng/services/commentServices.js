angular.module('commentServices',[])
.factory('Comment', function($http){
  commentFactory = {};

// Gallery.readPhotoData(user_id)
  commentFactory.createComment = function(commentData){
    return $http.post('/api/comment',commentData);
  };


  return commentFactory;
});
