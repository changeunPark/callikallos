angular.module('userServices',[])
.factory('User', function($http){
  userFactory = {};

  userFactory.getPermission = function(){
    return $http.get('/api/permission');
  };
// User.create(regData)
  userFactory.create = function(regData){
    return $http.post('/api/users', regData);
  };

// User.activeAccount(token);
  userFactory.activeAccount = function(token){
    return $http.put('/api/activate/'+token);
  };

// User.checkCredentials(loginData);
  userFactory.checkCredentials = function(loginData){
    return $http.post('/api/resend', loginData);
  };

// User.resendLink(username)
  userFactory.resendLink = function(username){
    return $http.put('/api/resend', username);
  };

// User.sendUsername(userData);
  userFactory.sendUsername = function(userData){
    return $http.get('/api/resetusername/'+userData);
  };

// User.sendPassword(resetData);
  userFactory.sendPassword = function(resetData){
    return $http.put('/api/resetpassword', resetData);
  };

// User.resetPassword(token);
  userFactory.resetPassword = function(token){
    return $http.get('/api/resetpassword/'+token);
  };


// User.savePassword(regData)
  userFactory.savePassword = function(regData){
    return $http.put('/api/savepassword', regData);
  };

//  User.renewSession(username)
  userFactory.renewSession = function(username){
    return $http.get('/api/renewToken/'+ username);
  };

// User.resetPermission(userData)
  userFactory.resetPermission = function(userData){
    return $http.put('/api/users/', userData);
  };

// User.checkPermission(userData)
  userFactory.checkPermission = function(username){
    return $http.get('/api/users/'+username);
  };


// reset / check / renew / save / send // resend

// Create // read // update // delete //

// User.readProfiles(username)
  userFactory.readProfiles = function(username){
    return $http.get('/api/userProfiles/'+username);
  };

// User.updateProfiles(updateData)
  userFactory.updateProfiles = function(updateData){
    return $http.put('/api/userProfiles', updateData);
  };

  return userFactory;
});
