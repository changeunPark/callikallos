angular.module('artistControllers',['userServices', 'artistServices'])
.controller('artistTapCtrl', function($scope, Artist){
  // 전체 메뉴 가져오기
  Artist.readArtistTap().then(function(data){
    if(data.data.success){
      $scope.headers = data.data.result;
    } else {
      app.errorMsg = data.data.message;
    }
  });
})

.controller('artistsCtrl', function ($stateParams, Artist) {
    var app = this;
    var user_type = $stateParams.code;

    app.data = {
     availableOptions: [
       {sort: '-created', name: '최신순'}
     ],
     selectedOption:  {sort: '-created', name: '최신순'} //This sets the default value of the select in the ui
     };

      Artist.readArtists(user_type).then(function(data){
        if(data.data.success){
          app.artistDatas = data.data.result;
        } else {
          app.errorMsg = data.data.message;
        }
      });
})

.controller('uploadCtrl', function ($http, $timeout, $scope, Artist, $state) {
    var app = this;

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
      app.disabled = true;
      $scope.$emit('LOAD');
      var fd = new FormData();
      fd.append('myfile', app.file.upload);
        $http.post('/api/uploadTemp/', fd,{
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }).then(function(data){
        if(data.data.success){
          $scope.$emit('UNLOAD');
          app.disabled = false;
          app.successMsg = data.data.message;
          app.mainImagePath = data.data.photo_path;
          app.file = {};
        } else {
          $scope.$emit('UNLOAD');
          app.disabled = false;
          app.errorMsg = data.data.message;
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

            app.uploadData = uploadData;
            app.uploadData.user_id = $scope.main.user.user_id;
            app.uploadData.photo_type = app.data.selectedOption.id;
            app.uploadData.photo_path = app.mainImagePath;

            Artist.createAristPhoto(app.uploadData).then(function(data){
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

})

.controller('artistProfileCtrl', function ($timeout, Artist, $state, $scope) {

    var app = this;
    app.data = {
     availableOptions: [
       {id: '0', name: '카테고리를 선택해주세요.'},
       {id: '1', name: '붓 글씨'},
       {id: '2', name: '펜 글씨'},
       {id: '3', name: '미분류'}
     ],
     selectedOption: {id: '0', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
     };

  // 작가 프로필 생성
      this.updateAristProfile = function(artistData){
        app.errorMsg = false;
        if(!artistData){
          app.errorMsg = '필수기재사항을 입력해주세요.';
        } else {
          if(app.artistData.short_info === undefined || app.artistData.short_info === null || app.artistData.short_info === '') {
            app.errorMsg = '한 줄 소개를 입력해주세요.';
          } else if(app.artistData.detail_info === undefined || app.artistData.detail_info === null || app.artistData.detail_info === '') {
            app.errorMsg = '상세 소개를 입력해주세요.';
          } else {
            app.artistData = artistData;
            app.artistData.user_id =  $scope.main.user.user_id;
            app.artistData.user_type =  app.data.selectedOption.id;

            Artist.updateAristProfile(app.artistData).then(function(data){
              if(data.data.success){
                app.errorMsg = false;
                app.successMsg = data.data.message;
                app.disabled = true;
                $timeout(function() {
                  $state.reload();
                }, 2000);
              } else {
                app.errorMsg = '올바르지 않은 값이 입력되었습니다.';

              }
            });

          }
        }
      };

      this.readAristProfile = function(){
        var user_id = $scope.main.user.user_id;
        Artist.readArtistProfile(user_id).then(function(data){
          if(data.data.success){
            app.artistData = data.data.result;
          } else {
            app.errorMsg = data.data.message;
          }
        });

      };
})

.controller('artistPhotoCtrl', function ($timeout, Artist, $state, $scope) {
    var app = this;
      var user_id = $scope.main.user.user_id;
      Artist.readArtistProfile(user_id).then(function(data){
        if(data.data.success){
          app.artistData = data.data.result;
        } else {
          app.errorMsg = data.data.message;
        }
      });

      Artist.readAristPhoto(user_id).then(function(data){
        if(data.data.success){
          app.artistPhotos = data.data.result;
        } else {
          app.errorMsg = data.data.message;
        }
      });


});
