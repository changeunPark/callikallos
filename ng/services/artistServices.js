angular.module('artistServices',[])
.factory('Artist', function($http){
  artistFactory = {};


// ===================== Artist Category =========================== //
  artistFactory.readArtistTap = function(){
     return $http.get('/api/artistMenu');
  };

  artistFactory.readArtists = function(user_type){
    return $http.get('/api/artistMenu/'+user_type);
  };

  artistFactory.readArtist = function(artist_id){
    return $http.get('/api/artist/'+artist_id);
  };

// ======================================================================= //

// Artist.createPhoto(photoData)
  artistFactory.createAristPhoto = function(photoData){
    return $http.post('/api/artistProfiles', photoData);
  };

// Artist.updateAristInfo(artistData)
  artistFactory.updateAristProfile = function(artistData){
    return $http.put('/api/artistProfiles', artistData);
  };

// Artist.readArtistProfile(user_id)
  artistFactory.readArtistProfile = function(user_id){
    return $http.get('/api/artistProfiles/'+user_id);
  };

//
  artistFactory.readAristPhoto = function(user_id){
    return $http.get('/api/artistPhotos/'+user_id);
  };

  return artistFactory;
});
