var router = require('express').Router();

router.get('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

        var selectSql = 'select * from photo_type';
				//Select a record.
          connection.query(selectSql, function (err, result, next) {
          if(err){
            console.error('SQL error: ', err);
            return next(err);
          }
					else {
            if(!result){
              res.json({success:false, message:'정보를 불러오지 못하였습니다.'});
            } else {
              res.json({success:true, message:'정보를 불러왔습니다.', result:result});
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



router.get('/:photo_type', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var selectSql = 'select B.*, (select username from users where user_id = B.user_id) as username, (select description from photo_type where code = B.photo_type) as description, (select profile_image from users where user_id = B.user_id) as profile_image, (select count(*) from comment where photo_id = B.photo_id) as comment_count, (select count(*) from opinion where photo_id = B.photo_id) as opinion_count from my_photos B where photo_type = ?;';
        var selectValue = req.params.photo_type;
        if(selectValue === '0'){
          selectSql = 'select B.*, (select username from users where user_id = B.user_id) as username, (select description from photo_type where code = B.photo_type) as description, (select profile_image from users where user_id = B.user_id) as profile_image, (select count(*) from comment where photo_id = B.photo_id) as comment_count, (select count(*) from opinion where photo_id = B.photo_id) as opinion_count from my_photos B;';
          connection.query(selectSql, function (err, result, next) {
          if(err){
    						res.send(err);
          }
					else {
            if(!result){
              res.json({success:false, message:'정보를 불러오지 못 하였습니다.'});
            } else {
              res.json({success:true, message:'정보를 불러왔습니다.', result: result});
            }
					}
				});
        }

        else {
          connection.query(selectSql, selectValue, function (err, result, next) {
          if(err){
                res.send(err);
          }
          else {
            if(!result){
              res.json({success:false, message:'정보를 불러오지 못 하였습니다.'});
            } else {
              res.json({success:true, message:'정보를 불러왔습니다.', result: result});
            }
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


module.exports = router;
