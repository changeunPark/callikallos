var router = require('express').Router();
var multer = require('multer');
var base64Img = require('base64-img');

router.post('/', function(req, res, next){
  var base64Str ='data:image/png;base64,'+req.body.data;
  var fileName = Date.now();
  var filePath = './assets/images/summernote';
  base64Img.img(base64Str, filePath, fileName, function(err, filePath) {
    if(err) {
      res.json({success:false, message: err});
    } else {
      filePath = '/images/summernote/'+fileName+'.png';
      res.json({success:true, message:'프로필 이미지 업로드 성공!', filePath: filePath});
    }
  });

});



module.exports = router;
