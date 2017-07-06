angular.module('app')
  .controller('ImageCropCtrl', function($scope, $http) {
    var app = this;
    app.myImage='';
    app.myCroppedImage='';

    var handleFileSelect=function(evt) {
      $scope.imageuploaded = false;
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          app.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
      angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

      function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (matches.length !== 3) {
          return new Error('Invalid input string');
        } else {
          var file = {
            type : matches[1],
            data : matches[2]
          };
          return file;
        }
      }

      app.readCropImage = function(data){
        if(data.base64Url === '' || data.base64Url === null || data.base64Url === undefined){
          console.log('이미지를 선택해주세요.');
        } else {
          var blob = decodeBase64Image($scope.myCroppedImage);
          $http.post('/uploadImage', blob).then(function(data){
            if(data.data.success){
              console.log(data.data.filePath);
              $scope.imageuploaded = true;
            } else {

            }
          });
        }


        // sendFile($scope.myCroppedImage);
      };





      // function sendFile(file) {
      //         data = new FormData();
      //         data.append("file", file);
      //         $.ajax({
      //             url: '/uploadImage',
      //             data: data,
      //             cache: false,
      //             type: "POST",
      //             contentType: false,
      //             processData: false,
      //             success: function(url) {
      //                 $('#summernote').summernote('insertImage', url);
      //             }
      //         });
      //     }


  });
