angular.module('artistServices',[])
.factory('Artist', function($http){
  artistFactory = {};

// Artist.createPhoto(photoData)
  artistFactory.createPhoto = function(photoData){
    return $http.post('/api/upload', photoData);
  };

  // Artist.updateAristInfo(artistData)
  artistFactory.updateAristInfo = function(artistData){
    return $http.put('/api/artistProfiles', artistData);
  };
  return artistFactory;
});
