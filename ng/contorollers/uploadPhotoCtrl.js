angular.module('app').controller('UploadPhotoController', function ($scope, $http, $timeout, uploadFile, $state, $stateParams, $location, $window) {

$scope.data = {
 availableOptions: [
   {id: '0', name: '카테고리를 선택해주세요.'},
   {id: '1', name: '캘리그라피'},
   {id: '2', name: '서예'},
   {id: '3', name: '문인화'}
 ],
 selectedOption: {id: '0', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
 };

// 파일의 경로만 저장하기
$scope.file = {};

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
              });
          };
      } else {
          $scope.mainThumbnail = {};
          $scope.message = false;
      }
  };


$scope.insertPhotoTemp = function(){
  var fd = new FormData();
  $scope.$emit('LOAD');
  fd.append('myfile', $scope.file.upload);
    $http.post('/api/uploadTemp/', fd,{
    transformRequest: angular.identity,
    headers: {'Content-Type': undefined}
  }).then(function(data){
    if (data.data.length === 2) {
        $scope.$emit('UNLOAD');
        $scope.alert = 'alert alert-success';
        $scope.message = data.data[1].message;
        $scope.mainImagePath = data.data[0];
        $scope.mainImageStatus = true;
        $scope.file = {};
    } else {
        $scope.$emit('UNLOAD');
        $scope.alert = 'alert alert-danger';
        $scope.message = data.data.message;
        $scope.mainImageStatus = false;
        $scope.file = {};
      }
    });
  };

// 이미지 파일을 어떻게 진행해야하지?
$scope.insertPhoto = function(title, detail){
  if($scope.data.selectedOption.id === '0'){
    $scope.mainMessageStatus = true;
    $scope.alert = 'alert alert-danger';
    $scope.mainMessage = '카테고리를 선택해주세요.';
  } else if($scope.mainImagePath === undefined || $scope.mainImagePath === null){
    $scope.mainMessageStatus = true;
    $scope.alert = 'alert alert-danger';
    $scope.mainMessage = '이미지를 업로드해주세요.';
  } else if(title === undefined || title === null){
    $scope.mainMessageStatus = true;
    $scope.alert = 'alert alert-danger';
    $scope.mainMessage = '작품 제목을 입력해주세요.';
  } else if(detail === undefined || detail === null){
    $scope.mainMessageStatus = true;
    $scope.alert = 'alert alert-danger';
    $scope.mainMessage = '작품 설명을 입력해주세요.';
  } else {
    if($scope.mainImageStatus){
      $http.post('/api/upload/',
      { title:title, detail: detail, mainImage: $scope.mainImagePath, type: $scope.data.selectedOption.id, user_id: $scope.main.user_id})
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

});
