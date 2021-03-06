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

  artistFactory.readAristCrop = function(blob){
    return $http.post('/uploadImage', blob);
  };
  
// Artist.createPhoto(photoData)
  artistFactory.createAristPhoto = function(photoData){
    return $http.post('/api/artistProfiles', photoData);
  };

// Artist.updateAristInfo(artistData)
  artistFactory.updateAristProfile = function(artistData){
    return $http.put('/api/artistProfiles', artistData);
  };

// Artist.readArtistProfile(user_id)
  artistFactory.readArtistProfile = function(artist_id){
    return $http.get('/api/artistProfiles/'+artist_id);
  };

//
  artistFactory.readAristPhoto = function(artist_id){
    return $http.get('/api/artistPhotos/'+artist_id);
  };

  return artistFactory;
});
