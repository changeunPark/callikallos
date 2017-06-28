angular.module('gallertControllers',['galleryServices'])
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
      } else {
        app.errorMsg = data.data.message;
      }
    });
})

.controller('galleryPhotoCtrl', function ($scope, $stateParams, Gallery) {

   var app = this;
   var photo_id = $stateParams.photo_id;
   var photo_type = $stateParams.photo_type;
   var user_id = $scope.main.user.user_id;

   Gallery.readPhotoData(photo_id).then(function(data){
     if(data.data.success){
       app.photoData = data.data.result;
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
