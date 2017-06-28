angular.module('app')
  .controller('ImageCropCtrl', function($scope) {
    var app = this;

      $scope.myCroppedImage = '';
      $scope.myImage = undefined;
      $scope.crobject = {};

      var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
          $scope.$apply(function($scope) {
            $scope.myImage = evt.target.result;
          });
        };
        reader.readAsDataURL(file);
      };
      angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);


      this.imageCrop = function() {
        var imgBlob = $scope.myImage;
        console.log(imgBlob);
      };
    });
