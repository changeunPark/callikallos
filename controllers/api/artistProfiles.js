var router = require('express').Router();

router.post('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
          if(req.body.title === '' || req.body.title === undefined || req.body.title === null){
              res.status(201).send({success:false, message:'올바른 작품 제목을 입력해주세요.'});
          } else if(req.body.photo_type === '' || req.body.photo_type === undefined || req.body.photo_type === null) {
              res.status(201).send({success:false, message:'올바른 작품 타입을 선택해주세요.'});
          } else if(req.body.photo_path === '' || req.body.photo_path === undefined || req.body.photo_path === null) {
              res.status(201).send({success:false, message:'올바른 작품 이미지를 선택해주세요.'});
          } else if(req.body.detail === '' || req.body.detail === undefined || req.body.detail === null) {
              res.status(201).send({success:false, message:'올바른 작품 설명을 입력해주세요.'});
          } else {

            var insertSql = 'INSERT INTO my_photos set ?';
            var insertValue = {
              user_id:req.body.user_id,
              photo_title:req.body.title,
              photo_detail:req.body.detail,
              photo_path:req.body.photo_path,
              photo_type:req.body.photo_type
            };

            connection.query(insertSql, insertValue, function (error, results, next) {
            // databases에서  select 문으로 중복된 사용자 찾아야함.
                if(err){
                  console.error('SQL error: ', err);
                  return next(err);
                } else{
                  res.status(201).send({success:true, message:'작품이 등록되었습니다.'});
                }
            });

          }
      }
  });
}
catch(ex){
  console.error("Internal error: "+ex);
  return next(ex);
}
});


router.get('/:artist_id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

        var selectSql = 'select my_profile.*, users.profile_image, users.username, users.email from my_profile left join users on my_profile.user_id = users.user_id where my_profile.user_id = ?;';
        var artist_id = req.params.artist_id;

        connection.query(selectSql, artist_id, function (error, results, next) {
        // databases에서  select 문으로 중복된 사용자 찾아야함.
            if(err){
              console.error('SQL error: ', err);
              return next(err);
            } else{
              if(!results[0]){
                res.status(201).send({success:false, message:'사용자 정보를 불러오지 못하였습니다.'});
              } else {
                res.status(201).send({success:true, message:'사용자 정보를 불러왔습니다.', result: results[0]});
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

// 사용자 상세 정보 API
router.put('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        return next(err);
      }
      else {
        var updateRecord = 'UPDATE my_profile SET ? WHERE user_id = ?';
        var updateValue = {
          short_info:req.body.short_info,
          detail_info:req.body.detail_info,
          // social_site:req.body.social_site,
          // public_email:req.body.public_email,
          // user_type: req.body.user_type,
        };
        var user_id = req.body.user_id;

        connection.query(updateRecord, [updateValue, user_id], function (error, results, next) {
        // databases에서  select 문으로 중복된 사용자 찾아야함.
            if(err){
              console.error('SQL error: ', err);
              return next(err);
            } else{
              res.status(201).send({success:true, message:'사용자 상세정보가 변경되었습니다.'});
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
