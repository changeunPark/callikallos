angular.module('emailController',['userServices'])
.controller('emailCtrl', function($stateParams, User, $timeout, $state){
  var app = this;
  User.activeAccount($stateParams.token).then(function(data){
    app.successMsg = false;
    app.errorMsg = false;
    if(data.data.success){
      app.successMsg = data.data.message + '...Redirecting';
      $timeout(function(){
        $state.go('app');
      },2000);
    }else {
      app.errorMsg = data.data.message + '...Redirecting';
      $timeout(function(){
        $state.go('app');
      },2000);

    }

  });



})

.controller('resendCtrl', function(User){
  app = this;
  this.checkCredentials = function(loginData){
    app.successMsg = false;
    app.errorMsg = false;
    app.disabled = true;

    User.checkCredentials(this.loginData).then(function(data){
      if(data.data.success){
        User.resendLink(app.loginData).then(function(data){
          if(data.data.success){
            app.successMsg = data.data.message;
            app.disabled = true;
          }
        });

      }else {
        app.disabled = false;
        app.errorMsg = data.data.message;
      }
    });

  };
});
