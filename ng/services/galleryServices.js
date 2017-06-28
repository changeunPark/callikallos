angular.module('galleryServices',[])
.factory('Gallery', function($http){
  galleryFactory = {};

// Gallery.readGalleryTap()
  galleryFactory.readGalleryTap = function(){
    return  $http.get('/api/galleryMenu');
  };

// Gallery.readPhotos(photo_type);
  galleryFactory.readPhotos = function(photo_type){
    return  $http.get('/api/galleryMenu/'+photo_type);

  };
// Gallery.readPhotoData(user_id)
  galleryFactory.readPhotoData = function(photo_id){
    return $http.get('/api/gallery/'+photo_id);
  };

  galleryFactory.readMorePhoto = function(photo_type){
    return $http.get('/api/galleryMenu/'+ photo_type);
  };


  return galleryFactory;
});
