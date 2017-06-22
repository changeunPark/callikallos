angular.module('mainController',['authServices', 'userServices'])
.controller('mainCtrl', function(Auth, $timeout, $location, $state, $rootScope, $window, $interval, User, AuthToken){
  var app = this;

  app.loadme = false;

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

          if(timeCheck <= 25){
            showModal('expired');
            $interval.cancel(interval);
          } else {
          }
        }
      }, 2000);
    }
  };

  checkSession();



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
        $location.path('/');
        hideModal('logout');
        $state.reload();
      }, 2000);
    } else if(option === 'login'){
// Login
      $("#login").modal({backdrop:"static"});

    } else if(option ==='register'){
      $("#register").modal({backdrop:"static"});
    }
      $timeout(function(){
        if(!app.choicMade){
          hideModal('logout');
        }
      }, 4000);

  };

  app.renewSession = function(){
    app.choicMade = true;
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
    app.choicMade = true;
    hideModal('logout');
    $timeout(function(){
      showModal('logout');
    },500);
  };

  var hideModal = function(option){

    if(option === 'expired'){
      $("#myModal").modal('hide');
    } else if(option === 'logout'){
      $("#myModal").modal('hide');
    } else if(option === 'login'){
      $("#login").modal('hide');
    } else if(option === 'register'){
      $("#register").modal('hide');
    }
  };

  $rootScope.$on('$stateChangeStart', function(){
    if(!checkSession)checkSession();

    if(Auth.isLoggedIn()){
      app.isLoggedIn = true;
      Auth.getUser().then(function(data){
        app.user = data.data;
        app.loadme = true;
      });
    }else {
      app.user = false;
      app.isLoggedIn = false;
      app.loadme = true;
    }
  });

  this.doLogin = function(loginData, valid){
    app.errorMsg = false;
    app.expired = false;
    app.disabled = false;

    if(valid){
      Auth.login(app.loginData).then(function(data){
        if(data.data.success){
          app.successMsg = data.data.message;
          $timeout(function(){
            hideModal('login');
            app.loginData = null;
            app.disabled = true;
            app.successMsg = false;
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
      app.errorMsg = 'Please ensure form is filled our properly'; // Display error if valid returns false
    }

  };

  this.regUser = function(regData, valid, confirmed){
    app.errorMsg = false;
    app.disabled = true;

    if(valid && confirmed){
      User.create(app.regData).then(function(data){
        if(data.data.success){
          app.disabled = true;
          app.successMsg = data.data.message;
          $timeout(function(){
            $location.path('/');
            hideModal('register');
            app.loginData = null;
            app.disabled = true;
            app.successMsg = false;
            app.isLoggedIn = true;
            checkSession();
            $state.reload();
          },2000);
        }else {
          app.disabled = false;
          app.errorMsg = data.data.message;
        }
      });

    } else {
         app.disabled = false; // If error occurs, remove disable lock from form
         app.loading = false; // Stop bootstrap loading icon
         app.errorMsg = 'Please ensure form is filled our properly'; // Display error if valid returns false
    }

  };

  app.login = function(){
    showModal('login');
  };
  app.register = function(){
    showModal('register');
  };

  app.loginToReg = function(){
    hideModal('register');
    showModal('login');
  };

  app.logout = function(){
    showModal('logout');
  };


});
