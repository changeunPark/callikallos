angular.module('mainController',['authServices'])
.controller('mainCtrl', function(Auth, $timeout, $location, $state, $rootScope, $window, $interval){
  var app = this;

  app.loadme = false;

  app.checkSession = function(){
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

          if(timeCheck <= 0){
            showModal(1);
            $interval.cancel(interval);
          } else {
          }
        }
      }, 2000);
    }
  };

  app.checkSession();

  var showModal = function(option){

    app.choiceMade = false;
    app.modalHeader = undefined;
    app.modalBody = undefined;
    app.hideButton = false;

// check token expired
    if(option ===  1 ){
      app.modalHeader = 'Timeout Warning';
      app.modalBody = 'Your session will expired in 5 minutes. Would you like to renew your session?';
      $("#myModal").modal({backdrop:"static"});
    } else if(option === 2){
// logout
      app.hideButton = true;
      app.modalHeader = '로그아웃...';
      $("#myModal").modal({backdrop:"static"});
      $timeout(function(){
        Auth.logout();
        $location.path('/');
        hideModal(2);
        $state.reload();
      }, 2000);
    } else if(option === 3){
// Login
      $("#login").modal({backdrop:"static"});

    }
      $timeout(function(){
        if(!app.choicMade){
          console.log('LOGGED OuT!!!');
          hideModal(2);
        }
      }, 4000);

  };

  app.renewSession = function(){
    app.choicMade = true;
    hideModal(2);

  };

  app.endSession = function(){
    app.choicMade = true;
    hideModal(2);

  };

  var hideModal = function(option){

    if(option === 1){
      $("#myModal").modal('hide');
    } else if(option === 2){
      $("#myModal").modal('hide');
    } else if(option === 3){
      $("#login").modal('hide');
    }
  };

  $rootScope.$on('$stateChangeStart', function(){
    if(!app.checkSession) app.checkSession();

    if(Auth.isLoggedIn()){
      app.isLoggedIn = true;
      Auth.getUser().then(function(data){
        app.user = data.data;
        app.loadme = true;
      });
    }else {
      app.username = false;
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
            $location.path('/');
            hideModal(3);
            app.loginData = null;
            app.disabled = true;
            app.successMsg = false;
            app.isLoggedIn = true;
            app.checkSession();
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

  app.login = function(){
    showModal(3);
  };

  app.logout = function(){
    showModal(2);
  };


});
