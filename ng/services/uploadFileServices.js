angular.module('app')
.service('uploadFile', function($http, $stateParams){
  this.upload = function(file){
    var fd = new FormData();
    fd.append('myfile', file.upload);
    return $http.post('/api/upload', fd,{
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    });
  };
});
