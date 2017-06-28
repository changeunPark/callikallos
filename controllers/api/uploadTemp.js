var router = require('express').Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './assets/images/photos');
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

var upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }
}).single('myfile');

// 유저 정보 중 이미지 업로드 API // myProfile.js
// 서버에 저장하지 않고 Path만 저장
router.post('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
				upload(req, res, function(err) {
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
                  // 여기서 프로필 이미지인지 작품 이미지인지 구별해서 보내면 되겠네. API 재사용? 이런걸 말하는건가?
											var dbfilePath = '/images/photos/';
                      var photo_path = dbfilePath + req.file.filename;
                      res.status(201).send({success:true, message:'이미지가 업로드 되었습니다.', photo_path: photo_path});
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
router.put('/:user_id', function(req, res, next){
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
                      // var user_id = req.auth.user_id;
              				var updateValue = {
                        profile_image: dbfilePath + req.file.filename
              				};
              				var updateRecord = 'UPDATE users SET ? WHERE user_id = ?';
                      var user_id = req.params.user_id;
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
