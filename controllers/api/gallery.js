var router = require('express').Router();

// 사용자 정보 변경
router.put('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        if(!req.headers['x-auth']){
          console.log('로그인이 필요합니다.');
        }
        else {
          var updateValue = {
            user_id:req.auth.user_id,
            photo_title:req.body.title,
            photo_detail:req.body.detail,
            photo_path:req.body.mainImage,
            photo_type:req.body.type
          };

          var photo_id = req.body.photo_id;
          var updateRecord = 'UPDATE my_photos SET ? WHERE photo_id = ?';
          // connection.query('UPDATE * FROM employee WHERE id = ?', [id], function (err, employee) {
            connection.query(updateRecord, [updateValue, photo_id], function (err, response) {
          if(err) throw err;
          else {
            res.status(201).send({success:true, message:"이미지가 변경되었습니다."});
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
router.delete('/:id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
				var id = req.params.id;
				var dropRecord = 'DELETE FROM my_photos where photo_id = ?';
				connection.query(dropRecord, [id], function(err, result, next){
					if(err){
						res.send(err);
					}
					else{
						res.json(result);
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


router.get('/:id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

        var selectSql = 'select B.*, (select username from users where user_id = B.user_id) as username, (select profile_image from users where user_id = B.user_id) as profile_image, (select count(*) from comment where photo_id = B.photo_id) as comment_count, (select description from photo_type where code = B.photo_type) as description, (select short_info from my_profile where user_id = B.user_id) as author_detail from my_photos B where photo_id = ?;';
        var selectValue = req.params.id;
        var updateRecord = 'update my_photos set view = view +1 where photo_id = ?;';



// 사용자가 로그인 하지 않은 상태입니다.
            if(!req.headers['x-auth']){
                connection.query(selectSql, selectValue, function (err, result, next) {
                  if(err){
                      res.send(err);
                  } else {

                    // 새로고침 눌렀을 때 오류 잡아야 함
                    connection.query(updateRecord, selectValue, function(err, result, next){
                      if(err){
                        console.log(err);
                      } else {
                        // 작동 완료
                      }
                    });

                    res.status(201).send([result, {success:false, message:'사용자가 로그인하지 않은 상태입니다.'}]);
                  }
              });
            }

// 사용자가 로그인한 상태입니다.
           else {
               connection.query(selectSql, selectValue, function (err, result, next) {
                 if(err){
                     res.send(err);
                 } else {
                   if(result[0].user_id === req.auth.user_id)
                   {
                     // 새로고침 눌렀을 때 오류 잡아야 함
                     connection.query(updateRecord, selectValue, function(err, result, next){
                       if(err){
                         console.log(err);
                       } else {
                         // 작동 완료
                       }
                     });
                     res.status(201).send([result, {success:true, message:'사용자가 작성한 게시물입니다.'}]);
                   } else {
                     // 새로고침 눌렀을 때 오류 잡아야 함
                     connection.query(selectSql, selectValue, function(err, result, next){
                       if(err){
                         console.log(err);
                       } else {
                         // 작동 완료
                       }
                     });
                     res.status(201).send([result, {success:false, message:'사용자가 작성한 게시물이 아닙니다.'}]);
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
