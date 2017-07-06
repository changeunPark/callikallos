var router = require('express').Router();
var multer = require('multer');
var base64Img = require('base64-img');

// 유저 정보 중 이미지 업로드 API // myProfile.js
// 서버에 저장하지 않고 Path만 저장
router.post('/', function(req, res, next){
  var base64Str ='data:image/png;base64,'+req.body.data;
  var fileName = Date.now();
  var filePath = './assets/images/summernote';
  base64Img.img(base64Str, filePath, fileName, function(err, filePath) {
    if(err) {
      res.json({success:false, message: err});
    } else {
      res.json({success:true, message:'프로필 이미지 업로드 성공!', filePath: filePath});
    }
  });

});


// router.post('/', function(req, res){
//   var base64Str ='data:image/png;base64,'+req.body.data;
//   var path ='./assets/images/summernote';
//   var optionalObj = {'123123': '1231231231', 'type':'png'};
//
//   // base64ToImage(base64Str,path,optionalObj);
//
//   // Note base64ToImage function returns imageInfo which is an object with imageType and fileName.
//   var imageInfo = base64ToImage(base64Str,path,optionalObj);
//   console.log(imageInfo);
//




module.exports = router;
