angular.module('app')
.controller('GalleryController', function ($scope, $http, $timeout, $stateParams, $location, $window) {


$scope.data = {
 availableOptions: [
   {id: '0', name: '카테고리를 선택해주세요.'},
   {id: '1', name: '캘리그라피'},
   {id: '2', name: '서예'},
   {id: '3', name: '문인화'},
   {id: '4', name: '전각'},
   {id: '5', name: '음각'},
 ],
 selectedOption: {id: '0', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
 };


// 값을 삭제하는 함수
  $scope.deletePhoto = function(){
     var id = $stateParams.photo_id;
    $http.delete('/api/gallery/'+id).then(function(response){
         $location.path('app.gallery.category({code: 0})');
    });
  };

// 개별 사진에 대한 정보 가져오기 || 선택한 이미지에 대한 정보가져오기
  $scope.getphoto = function(){
    var id = $stateParams.photo_id;
    $http.get('/api/gallery/'+id).then(function(response){
      // 사용자가 작성한 게시물입니다.
        if(response.data[1].success){
          $scope.userArticle = true;
          $scope.photo = response.data[0][0];
        }
      // 사용자가 작성한 게시물이 아닙니다.
        else {
          $scope.userArticle = false;
          $scope.photo = response.data[0][0];
        }
    });
  };

// 개별 사진 관련된 이미지 가져오기 || 선택한 이미지와 같은 분류의 이미지 가져오기
  $scope.getRelatedPic = function(){
    var code = $stateParams.photo_type;
    $http.get('/api/galleryMenu/'+code).then(function(response){
      $scope.photos = response.data;
    });
  };


  $scope.file = {};
// my_photos.html
  $scope.insertPhoto = function(){
    $scope.uploading = true;
    var fd = new FormData();
    fd.append('myfile', $scope.file.upload);
      $http.post('/api/upload/', fd,{
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(function(data){
      if (data.data.length === 2) {
          $window.alert(data.data[1].message);
          $scope.uploading = false;
          $scope.mainImagePath = data.data[0];
          $scope.mainImageStatus = true;
          $scope.file = {};
      } else {
          $window.alert(data.data.message);
          $scope.uploading = false;
          $scope.mainImageStatus = false;
          $scope.file = {};
        }
      });
    };

  $scope.mainPhotoChanged = function(files) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.mainThumbnail = {};
                    $scope.mainThumbnail.dataUrl = e.target.result;
                    $scope.uploading = false;
                    $scope.message = false;
                },2000);
            };
        } else {
            $scope.mainThumbnail = {};
            $scope.message = false;
        }
    };

    // 이미지 파일을 흠 어떻게 진행해야하지?
    $scope.insertPhotoInfo = function(title, detail){
      if($scope.data.selectedOption.id === '0'){
        $scope.mainMessageStatus = true;
        $scope.alert = 'alert alert-danger';
        $scope.mainMessage = '카테고리를 선택해주세요.';
      } else {
        if($scope.mainImageStatus){
          $http.post('/api/myProfile/',
          { title:title, detail: detail, mainImage: $scope.mainImagePath, type: $scope.data.selectedOption.id})
          .then(function(response){
            $scope.mainMessageStatus = true;
            $scope.alert = 'alert alert-success';
            $scope.mainMessage = response.data.message;
            // 정상 작동하였습니다.
          });
        } else {
            $scope.mainMessageStatus = true;
            $scope.alert = 'alert alert-danger';
            $scope.mainMessage = '정보를 입력해주세요.';
        }
      }

    };
  // 이미지 파일을 흠 어떻게 진행해야하지?
  $scope.insertPhotoInfo = function(){
    if($scope.data.selectedOption.id === '0'){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '카테고리를 선택해주세요.';
    } else if($scope.photo.photo_title === undefined || $scope.photo.photo_title === null){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '작품 제목을 입력해주세요.';
    } else if($scope.photo.photo_detail === undefined || $scope.photo.photo_detail === null){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '작품 설명을 입력해주세요.';
    } else {
// 이미지를 변경하지 않았을 때
      if($scope.mainImagePath === undefined || $scope.mainImagePath === null){
        $scope.mainImagePath = $scope.photo.photo_path;
        $scope.mainImageStatus = true;
        $http.put('/api/gallery/',
        { photo_id: $scope.photo.photo_id, title:$scope.photo.photo_title, detail: $scope.photo.photo_detail, mainImage: $scope.mainImagePath, type: $scope.data.selectedOption.id})
        .then(function(response){
          $scope.mainMessageStatus = true;
          $scope.alert = 'alert alert-success';
          $scope.mainMessage = '정보가 변경되었습니다.';
        });
      }
// 이미지를 변경하였을 때
      else {

// 정상 작동하였습니다.
        if($scope.mainImageStatus){
          $http.put('/api/gallery/',
          { photo_id: $scope.photo.photo_id, title:$scope.photo.photo_title, detail: $scope.photo.photo_detail, mainImage: $scope.mainImagePath, type: $scope.data.selectedOption.id})
          .then(function(response){
            $scope.mainMessageStatus = true;
            $scope.alert = 'alert alert-success';
            $scope.mainMessage = '정보가 변경되었습니다.';
          });
        }

// 정상 작동하지않았습니다.
        else {
            $scope.mainMessageStatus = true;
            $scope.alert = 'alert alert-danger';
            $scope.mainMessage = '정보를 입력해주세요.';
        }
      }

    }

  };
});
