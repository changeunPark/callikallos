angular.module('artistControllers',['userServices', 'artistServices'])
.controller('artistCtrl', function ($http, $timeout, $scope, Artist, $state) {
    var app = this;

    this.user_id = $scope.main.user.user_id;

    app.data = {
     availableOptions: [
       {id: '0', name: '카테고리를 선택해주세요.'},
       {id: '1', name: '붓 글씨'},
       {id: '2', name: '펜 글씨'},
       {id: '3', name: '미분류'}
     ],
     selectedOption: {id: '0', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
     };
    // 파일의 경로만 저장하기
    this.file = {};

    this.mainPhotoChanged = function(files) {
          if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
              var file = files[0];
              var fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = function(e) {
                  $timeout(function() {
                      app.mainThumbnail = {};
                      app.mainThumbnail.dataUrl = e.target.result;
                  });
              };
          } else {
              app.mainThumbnail = {};
          }
      };

    this.readPhoto = function(){
      app.errorMsg = false;

      var fd = new FormData();
      fd.append('myfile', app.file.upload);
        $http.post('/api/uploadTemp/', fd,{
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }).then(function(data){
        if(data.data.success){
          app.successMsg = data.data.message;
          app.mainImagePath = data.data.photo_path;
          app.mainImageStatus = true;
          app.file = {};
        } else {
          app.errorMsg = data.data.message;
          app.mainImageStatus = false;
          app.file = {};
        }
        });
      };

// 작가 작품 업로드
      this.createPhoto = function(uploadData){
        app.disabled = false;
        app.errorMsg = false;
        if(!uploadData){
          app.errorMsg = '빈칸을 모두 입력해주세요.';
          app.successMsg = false;
        } else {
          if(app.uploadData.title === undefined || app.uploadData.title === null || app.uploadData.title === '') {
            app.errorMsg = '작품의 제목을 입력해주세요.';
          } else if(app.uploadData.detail === undefined || app.uploadData.detail === null || app.uploadData.detail === '') {
            app.errorMsg = '작품의 설명을 입력해주세요.';
          } else if(app.mainImagePath === undefined || app.mainImagePath ===  null || app.mainImagePath === ''){
            app.errorMsg = '작품 이미지를 선택해주세요.';
          } else if(app.data.selectedOption.id === '0'){
            app.errorMsg = '작품의 종류를 선택해주세요.';
          } else {

            app.uploadData.user_id = app.user_id;
            app.uploadData.photo_type = app.data.selectedOption.id;
            app.uploadData.photo_path = app.mainImagePath;

            Artist.createPhoto(app.uploadData).then(function(data){
              if(data.data.success){
                app.successMsg = data.data.message;
                app.disabled = true;
                $timeout(function() {
                  $state.reload();
                }, 2000);
              } else {
                app.errorMsg = data.data.message;
                app.successMsg = false;
                app.disabled = false;


              }
            });

          }
        }
      };

// 작가 프로필 생성
    this.createAristInfo = function(artistData){

      app.artistData.user_id = this.user_id;
      app.uploadData.user_type = app.data.selectedOption.id;
      Artist.updateAristInfo(app.artistData).then(function(data){
      });

    };
});
