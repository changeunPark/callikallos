var router = require('express').Router();
var multer = require('multer');

var profilestorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './assets/images/profiles');
    },
    filename: function(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, Date.now() + '_' +file.originalname);
        }
    }
});

var profileupload = multer({
    storage: profilestorage,
    limits: { fileSize: 5000000 }
}).single('myfile');


// 기존에 미리 생성한 유저 테이블에 이미지 파일 경로 저장하기
router.put('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
				profileupload(req, res, function(err) {
		      //Incsert a record.
		        if (err) {
		            if (err.code === 'LIMIT_FILE_SIZE') {
		                res.json({ success: false, message: '5MB이하의 파일 사이즈를 권장합니다.'});
		            } else if (err.code === 'filetype') {
		                res.json({ success: false, message: 'png, jpeg, jpg 확장자를 권장합니다.' });
		            } else {
		                res.json({ success: false, message: '파일을 업로드 불가합니다.' });
		            }
		        } else {
		            if (!req.file) {
		                res.json({ success: false, message: '선택된 파일이 없습니다.' });
		            } else {
											var dbfilePath = '/images/profiles/';
                      var user_id = req.auth.user_id;
              				var updateValue = {
                        profile_image: dbfilePath + req.file.filename
              				};
              				var updateRecord = 'UPDATE users SET ? WHERE user_id = ?';
              				// connection.query('UPDATE * FROM employee WHERE id = ?', [id], function (err, employee) {
              					connection.query(updateRecord, [updateValue, user_id], function (err, response) {
		                	if(err) throw err;
		                	else {
                        res.status(201).send({success:true, message:"프로필 이미지가 업로드 변경되었습니다."});
		                  }
		                });
			            }
			      	}
			    });
      }
  });

}

catch(ex){
  console.error("Internal error: "+ex);
  return next(ex);
}
});



module.exports = router;
