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

        var selectSql = 'select B.*, (select description from user_type where code = B.user_type) as type_name from my_profile B where user_id = ?;';
        var user_id = req.auth.user_id;

        connection.query(selectSql, user_id, function (error, results, next) {
        // databases에서  select 문으로 중복된 사용자 찾아야함.
            if(err){
              console.error('SQL error: ', err);
              return next(err);
            } else{
              if(results[0] === undefined || results[0] === null || results[0] === ''){
                res.status(201).send({isEnrolled:false});
              } else {
                res.status(201).send(results[0]);
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
        console.log(req.body);

        // var updateRecord = 'UPDATE my_profile SET ? WHERE user_id = ?';
        // var updateValue = {
        //   short_info:req.body.response.short_info,
        //   detail_info:req.body.response.detail_info,
        //   social_site:req.body.response.social_site,
        //   public_email:req.body.response.public_email,
        //   user_type: req.body.user_type,
        // };
        // var user_id = req.auth.user_id;
        //
        // connection.query(updateRecord, [updateValue, user_id], function (error, results, next) {
        // // databases에서  select 문으로 중복된 사용자 찾아야함.
        //     if(err){
        //       console.error('SQL error: ', err);
        //       return next(err);
        //     } else{
        //       res.status(201).send({success:true, message:'사용자 상세정보가 변경되었습니다.'});
        //     }
        // });

      }
  });
}
catch(ex){
  console.error("Internal error: "+ex);
  return next(ex);
}
});


module.exports = router;
