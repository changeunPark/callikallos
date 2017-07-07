angular.module('gallertControllers',['galleryServices'])
.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])

.controller('galleryTapCtrl', function($scope, Gallery){
  // 전체 메뉴 가져오기
  Gallery.readGalleryTap().then(function(data){
    if(data.data.success){
      $scope.headers = data.data.result;
    } else {
      app.errorMsg = data.data.message;
    }
  });
})

.controller('galleryPhotosCtrl', function(Gallery, $stateParams){
  var app = this;
  var photo_type = $stateParams.code;
  app.data = {
   availableOptions: [
     {sort: '-created', name: '최신순'},
     {sort: '-view', name: '조회순'},
     {sort: '-comment_count', name:'댓글순'}
   ],
   selectedOption:  {sort: '-created', name: '최신순'} //This sets the default value of the select in the ui
   };

    Gallery.readPhotos(photo_type).then(function(data){
      if(data.data.success){
        app.photoData = data.data.result;
        console.log(app.photoData);
      } else {
        app.errorMsg = data.data.message;
      }
    });
})

.controller('galleryPhotoCtrl', function ($stateParams, Gallery, Comment, $scope, $window, $state) {

   var app = this;
   var photo_id = $stateParams.photo_id;
   var photo_type = $stateParams.photo_type;
   var user_id = $scope.main.user.user_id;

   Gallery.readPhotoData(photo_id).then(function(data){
     if(data.data.success){
       app.photoData = data.data.result;
       app.htmlcontent = data.data.result.photo_detail;
       console.log(app.htmlcontent);
     } else {
       app.errorMsg = data.data.message;
     }
   });

   Gallery.readPhotos(photo_type).then(function(data){
     if(data.data.success){
       app.photosData = data.data.result;
     } else {
       app.errorMsg = data.data.message;
     }
   });

   Comment.readComment(photo_id).then(function(data){
     if(data.data.success){
       app.commentData = data.data.result;
     } else {
       app.errorMsg = data.data.message;
     }
   });

   this.createComment = function(data){
       if(!$scope.main.user.user_id){
         $scope.main.login();
       } else {
         if(!data){
           $window.alert('댓글을 입력해주세요.');
         } else {
           var commentData = {
             comment : data,
             user_id : $scope.main.user.user_id,
             photo_id : photo_id
           };

           Comment.createComment(commentData).then(function(data){
             if(data.data.success){
               $state.reload();
             } else {

             }
           });
         }
       }
  };
});




// // 값을 삭제하는 함수
//   $scope.deletePhoto = function(){
//      var id = $stateParams.photo_id;
//     $http.delete('/api/gallery/'+id).then(function(response){
//          $location.path('app.gallery.category({code: 0})');
//     });
//   };
//
//
// // 개별 사진 관련된 이미지 가져오기 || 선택한 이미지와 같은 분류의 이미지 가져오기
//   $scope.getRelatedPic = function(){
//     var code = $stateParams.photo_type;
//     $http.get('/api/galleryMenu/'+code).then(function(response){
//       $scope.photos = response.data;
//     });
//   };
