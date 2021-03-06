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

.controller('uploadPhotoCtrl', function ($http, $timeout, $scope, Artist, $state, $window) {
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

// 파일의 경로만 저장하기 메인 이미지 만들기
    this.file = {};
// 메인 작품이미지 업로드 되었는지 보여주기
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
// 메인 작품 이미지 업로드해서 경로 저장
    this.readPhoto = function(){
// 메인 이미지 업로드 여부
      app.mainPhoto = false;
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
          $window.alert(data.data.message);
          app.mainPhoto = true;
          app.disabled = false;
          app.mainImagePath = data.data.photo_path;
          app.file = {};
        } else {
          $scope.$emit('UNLOAD');
          $window.alert(data.data.message);
          app.disabled = false;
          app.file = {};
        }
        });
      };

// 썸네일 이미지 만들기
      app.myImage='';
      app.myCroppedImage='';

      var handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
          $scope.$apply(function($scope){
            app.myImage=evt.target.result;
          });
        };
        reader.readAsDataURL(file);
      };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

        function decodeBase64Image(dataString) {
          var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

          if (matches.length !== 3) {
            return new Error('Invalid input string');
          } else {
            var file = {
              type : matches[1],
              data : matches[2]
            };
            return file;
          }
        }

// 썸네일 이미지 로컬디스크에 저장 후 저장 위치 가져오기
        app.readCropImage = function(data){
          app.thumbnail = false;
          app.disabled = true;
          $scope.$emit('LOAD');
          if(data.base64Url === '' || data.base64Url === null || data.base64Url === undefined){
            app.disabled = false;
          } else {
              if(!app.mainImagePath){
                $scope.$emit('UNLOAD');
                $window.alert('작품의 메인 이미지를 업로드해주세요.');
                app.disabled = false;
              } else {
                var blob = decodeBase64Image($scope.myCroppedImage);
                Artist.readAristCrop(blob).then(function(data){
                  if(data.data.success){
                    $scope.$emit('UNLOAD');
                    $window.alert(data.data.message);
                    app.thumbnail = true;
                    app.disabled = false;
                    app.thumbnailPath = data.data.filePath;
                  } else {
                    app.disabled = false;
                  }
                });
              }
          }
        };

// 작가 작품 업로드
      this.createPhoto = function(uploadData){
        app.disabled = true;
        app.errorMsg = false;
        if(!uploadData){
          app.errorMsg = '빈칸을 모두 입력해주세요.';
          app.disabled = false;
          app.successMsg = false;
        } else {
          if(app.uploadData.title === undefined || app.uploadData.title === null || app.uploadData.title === '') {
            app.errorMsg = '작품의 제목을 입력해주세요.';
          } else if($('#summernote').summernote('code') === '<p><br></p>' || $('#summernote').summernote('code') === null || $('#summernote').summernote('code') === undefined || $('#summernote').summernote('code') === '') {
            app.errorMsg = '작품의 설명을 입력해주세요.';
          } else if(app.mainImagePath === undefined || app.mainImagePath ===  null || app.mainImagePath === ''){
            app.errorMsg = '작품 이미지를 선택해주세요.';
          } else if(app.data.selectedOption.id === '0'){
            app.errorMsg = '작품의 종류를 선택해주세요.';
          } else if(app.thumbnailPath === undefined || app.thumbnailPath === null || app.thumbnailPath === '') {
            app.errorMsg = '썸네일 이미지를 선택해주세요.';
          } else {
            app.uploadData = {
              title: uploadData.title,
              detail: $('#summernote').summernote('code'),
              user_id: $scope.main.user.user_id,
              photo_type: app.data.selectedOption.id,
              photo_path: app.mainImagePath,
              photo_thumbnail: app.thumbnailPath
            };
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
// 작품 설명
      $(document).ready(function() {
        $('#summernote').summernote({
          toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
          ],
          height : 150,
          lang : 'ko-KR',
          placeholder: '작품의 설명을 입력해주세요.',
        });
      });

})

.controller('artistProfileCtrl', function ($timeout, Artist, $state, $scope) {

    var app = this;
    var user_id = $scope.main.user.user_id;

    app.data = {
     availableOptions: [
       {id: '0', name: '카테고리를 선택해주세요.'},
       {id: '1', name: '붓 글씨'},
       {id: '2', name: '펜 글씨'},
       {id: '3', name: '미분류'}
     ],
     selectedOption: {id: '0', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
     };


     Artist.readArtistProfile(user_id).then(function(data){
       if(data.data.success){
         app.artistData = data.data.result;
       } else {
         app.errorMsg = data.data.message;
       }
     });


  // 작가 프로필 생성
      this.updateAristProfile = function(artistData){
        console.log("작동 중");
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
            // app.artistData.user_type =  app.data.selectedOption.id;

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

})

// 작가 자신의 프로필
.controller('anArtistPhotoCtrl', function (Artist, $stateParams,  $scope) {
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
})


// 여러 작가들의 프로필
.controller('artistPhotoCtrl', function (Artist, $stateParams) {
    var app = this;
    var artist_id = $stateParams.artist_id;

      Artist.readArtistProfile(artist_id).then(function(data){
        if(data.data.success){
          app.artistData = data.data.result;
        } else {
          app.errorMsg = data.data.message;
        }
      });

      Artist.readAristPhoto(artist_id).then(function(data){
        if(data.data.success){
          app.artistPhotos = data.data.result;
        } else {
          app.errorMsg = data.data.message;
        }
      });
});
