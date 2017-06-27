angular.module('mainControllers',['authServices', 'userServices'])
.controller('mainCtrl', function(Auth, $timeout, $location, $state, $rootScope, $window, $interval, User, AuthToken){
  var app = this;

  app.loadme = false;

  $rootScope.$on('$stateChangeStart', function(){
    if(!checkSession)checkSession();

    if(Auth.isLoggedIn()){
      app.isLoggedIn = true;
      Auth.getUser().then(function(data){
        if(data.data.permission === 'admin') {
          app.admin = true;
          app.user = data.data;
          app.loadme = true;
        } else if(data.data.permission === 'artist') {
          app.artist = true;
          app.user = data.data;
          app.loadme = true;
        } else {
          app.user = data.data;
          app.loadme = true;
        }
      });
    } else {
      app.user = false;
      app.isLoggedIn = false;
      app.loadme = true;
    }
  });


  var checkSession = function(){
    if(Auth.isLoggedIn()){
      app.checkSession = true;
      var interval = $interval(function(){
        var token = $window.localStorage.getItem('token');
        if(token === null){
          $interval.cancel(interval);
        } else {
          self.parseJwt = function(token){
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-','+').replace('_', '/');
            return JSON.parse($window.atob(base64));
          };
          var expireTime = self.parseJwt(token);
          var timeStamp = Math.floor(Date.now() / 1000);
          var timeCheck = expireTime.exp - timeStamp;

          if(timeCheck <= 5){
            showModal('expired');
            $interval.cancel(interval);
          } else {
          }
        }
      }, 2000);
    }
  };

  checkSession();


    app.renewSession = function(){
      app.choiceMade = true;
      User.renewSession(app.user.username).then(function(data){
        if(data.data.success){
          AuthToken.setToken(data.data.token);
          checkSession();
        } else{
          app.ModalBody = data.data.message;
        }
      });
      hideModal('logout');
    };

    app.endSession = function(){
      app.choiceMade = true;
      hideModal('logout');
      $timeout(function(){
        showModal('logout');
      },500);
    };


  var showModal = function(option){
    app.choiceMade = false;
    app.modalHeader = undefined;
    app.modalBody = undefined;
    app.hideButton = false;
// check token expired
    if(option ===  'expired' ){
      app.modalHeader = 'Timeout Warning';
      app.modalBody = 'Your session will expired in 5 minutes. Would you like to renew your session?';
      $("#myModal").modal({backdrop:"static"});
    } else if(option === 'logout'){
// logout
      app.hideButton = true;
      app.modalHeader = '로그아웃';
      $("#myModal").modal({backdrop:"static"});
      $timeout(function(){
        Auth.logout();
        app.isLoggedIn = false;
        hideModal('logout');
        $state.reload();
      }, 2000);
    } else if(option === 'login'){
// Login
      $("#login").modal({backdrop:"static"});
    }  else if(option ==='upload'){
// enrollArtist
      $("#upload").modal({backdrop:"static"});
    }
      $timeout(function(){
        if(!app.choiceMade){
          hideModal('logout');
        }
      }, 4000);

  };

  var hideModal = function(option){

    if(option === 'expired'){
      $("#myModal").modal('hide');
    } else if(option === 'logout'){
      $("#myModal").modal('hide');
    } else if(option === 'login'){
      $("#login").modal('hide');
    } else if(option === 'upload'){
      $("#upload").modal('hide');
    }
  };


// 로그인
  this.doLogin = function(loginData, valid){
    app.errorMsg = false;
    app.expired = false;
    app.disabled = true;

    if(valid){
      Auth.login(app.loginData).then(function(data){
        if(data.data.success){
          app.disabled = true;
          app.successMsg = data.data.message;
          $timeout(function(){
            hideModal('login');
            app.loginData = null;
            app.isLoggedIn = true;
            checkSession();
            $state.reload();
          },2000);
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
    } else {
      app.disabled = false; // If error occurs, remove disable lock from form
      app.loading = false; // Stop bootstrap loading icon
      app.errorMsg = '올바른 정보를 입력해주세요.'; // Display error if valid returns false
    }

  };



// 사용자의 권한 여부 확인
  this.upload = function(){
  app.choiceMade = true;
    if(app.user.permission === 'artist'){
      $state.go('app.artistProfiles');
    } else {
      User.checkPermission(app.user.username).then(function(data){
        if(data.data.success){
          $state.go('app.artistProfiles');
           app.permission = true;
        } else {
          showModal('upload');
        }
      });
    }

  };

  // 사용자에게 권한 부여
    this.doPermission = function(){
      app.choiceMade = true;
      app.uploadDisabled = true;
      app.uploaderrorMsg = false;
      User.resetPermission(app.user).then(function(data){
        if(data.data.success){
          app.uploadDisabled = true;
          app.uploadSuccessMsg = data.data.message;
          $timeout(function(){
            hideModal('upload');
            $state.go('app.artistProfiles');
          },2000);
        } else {
          app.uploadDisabled = false;
          app.uploaderrorMsg = '잘못된 정보가 입력되었습니다.';
        }
      });
    };


  app.login = function(){
    app.successMsg = false;
    app.errorMsg = false;
    app.disabled = false;
    showModal('login');
  };

  app.logout = function(){
    showModal('logout');
  };

  app.resend = function(){
    hideModal('login');
    $timeout(function(){
      $state.go('resend');
      app.expired = false;
    },500);
  };

  app.resetusername = function(){
    hideModal('login');
    $timeout(function(){
      $state.go('resetusername');
    },500);
  };

  app.resetpassword = function(){
    hideModal('login');
    $timeout(function(){
      $state.go('resetpassword');
    },500);

  };

});
