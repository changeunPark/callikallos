var router = require('express').Router();

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
				var dropRecord = 'DELETE FROM board where board_id = ?';
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


router.put('/:id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
				var id = req.params.id;
				var query = {
          title: req.body.title,
          content: req.body.content

				};
				var updateRecord = 'UPDATE board SET ? WHERE board_id = ?';
				// connection.query('UPDATE * FROM employee WHERE id = ?', [id], function (err, employee) {
					connection.query(updateRecord, [query, id], function (err, result, next) {
					if(err)
						res.send(err);
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



router.get('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

        var selectValue = [
          "username",
          "comment_count",
          "opinion_count"
        ];
// select B.*, (select count(*) from opinion where board_id = B.board_id) as 'opinion_count' from board B;
        var selectSql = 'select B.*,  (select username from users where user_id = B.user_id) as ?, (select count(*) from comment where board_id = B.board_id) as ?, (select count(*) from opinion where board_id = B.board_id) as ? from board B;';
				//Select a record.
          connection.query(selectSql, selectValue, function (err, result, next) {
          if(err){
              res.send(err);
          }
					else {
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



// 해당 게시글의 정보 보여주기
router.get('/:board_id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var selectSql = 'select B.*,  (select username from users where user_id = B.user_id) as username, (select profile_image from users where user_id = B.user_id) as profile_image, (select count(*) from comment where board_id = B.board_id) as comment_count from board B WHERE board_id = ?;';
        var selectValue = req.params.board_id;
        var updateRecord = 'update board set view = view + 1 where board_id = ?';

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
                        if(!result){
                          res.json({success:false, message:'정보를 불러오지 못하였습니다.'});
                        } else {
                          res.json({success:true, message:'정보를 불러왔습니다.', result:result});
                        }
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
