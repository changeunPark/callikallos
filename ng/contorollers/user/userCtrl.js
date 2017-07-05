angular.module('userControllers',['userServices'])
.controller('regCtrl', function ( $http, $location, $timeout, User, Auth, $state) {
    var app = this;

      this.regStep1 = function(regData){
        app.errorMsg = false;
        if(!regData){
          app.errorMsg = '약관에 동의해야만 회원가입을 진행할 수 있습니다.';
        } else {
          if((regData.terms) && (regData.privacy)) {
                app.successMsg = '약관에 성공적으로 동의하셨습니다.';
                app.disabled = true;
                $state.go('registerStep2');
          } else {
                app.errorMsg = '약관에 동의해야만 회원가입을 진행할 수 있습니다.';
                app.disabled = false;
          }
        }

      };

    // 회원가입
      this.regStep2 = function(regData, valid, confirmed){
        app.errorMsg = false;
        app.disabled = true;

        if(valid && confirmed){
          User.create(app.regData).then(function(data){
            if(data.data.success){
              app.disabled = true;
              app.successMsg = data.data.message;
              Auth.login(app.regData).then(function(data){
                if(data.data.success){
                  app.disabled = true;
                  app.successMsg = data.data.message;
                  $timeout(function() {
                    $state.go('app');
                  },1000);
                }else {
                  if(data.data.expired){
                    app.expired = true;
                    app.disabled = true;
                    app.errorMsg = data.data.message;
                  } else {
                    app.disabled = false;
                    app.errorMsg = data.data.message;
                  }
                }
              });
            }else {
              app.disabled = false;
              app.errorMsg = data.data.message;
            }
          });

        } else {
             app.disabled = false; // If error occurs, remove disable lock from form
             app.loading = false; // Stop bootstrap loading icon
             app.errorMsg = '올바른 정보를 입력해주세요.'; // Display error if valid returns false
        }
      };

})

.controller('profileCtrl', function($scope, User, $timeout, $state, $http){
  var app = this;

// 기본 사용자 정보 가져오는 함수
  var username = $scope.main.user.username;
  User.readProfiles(username).then(function(data){
    if(data.data.success){
      app.readData = data.data.profiles;
    } else {
      app.errorMsg = data.data.message;
    }
  });


// 유저 프로필 사진 변경 함수
    this.file = {};
    this.photoChanged = function(files) {
          if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
              var file = files[0];
              var fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = function(e) {
                  $timeout(function() {
                      app.thumbnail = {};
                      app.thumbnail.dataUrl = e.target.result;
                      app.uploading = false;
                      app.message = false;
                  });
              };
          } else {
              app.thumbnail = {};
              app.message = false;
          }
      };

// 프로필 이미지를 업데이트하는 함수
    this.updateProfileImage = function(){
      app.errorMsg = false;
      app.disabled = true;
      $scope.$emit('LOAD');
      var fd = new FormData();
      var user_id = $scope.main.user.user_id;
      fd.append('myfile', app.file.upload);
        $http.put('/api/uploadTemp/'+user_id,  fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }).then(function(data){
        if (data.data.success) {
            $scope.$emit('UNLOAD');
            app.successMsg = data.data.message;
            app.file = {};
            $timeout(function(){
              $state.reload();
            }, 1000);
        } else {
            $scope.$emit('UNLOAD');
            app.disabled = false;
            app.errorMsg = data.data.message;
            app.file = {};
          }
      });
  };

// 프로필 정보 변경
  this.updateProfile = function(){
    app.errorMsg = false;
    app.disabled = true;
    app.readData.user_id = $scope.main.user.user_id;
    User.updateProfiles(app.readData).then(function(data){
      if(data.data.success){
        app.successMsg = data.data.message;
        $timeout(function(){
          $state.reload();
        },2000);
      } else {
        app.errorMsg = data.data.message;
        app.disabled = false;
      }
    });
  };

});
