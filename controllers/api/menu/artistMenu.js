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
        var selectSql = 'select * from user_type';
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


router.get('/:user_type', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var selectSql = 'select my_profile.*, users.permission, users.profile_image, users.username, user_type.description from ((my_profile left join users on users.user_id = my_profile.user_id) inner join user_type on my_profile.user_type = user_type.code) where user_type = ?;';
        var selectValue = 'artist';
        var selectCode = req.params.user_type;

        if(selectCode === '0'){
          selectSql = 'select my_profile.*, users.permission, users.profile_image, users.username, user_type.description from ((my_profile left join users on users.user_id = my_profile.user_id) inner join user_type on my_profile.user_type = user_type.code) where permission =?;';
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

        else {
          connection.query(selectSql, selectCode, function (err, result, next) {
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
