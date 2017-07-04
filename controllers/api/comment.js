var router = require('express').Router();

// 게시물에 해당한는 전체 댓글 가져오는 API
router.get('/:photo_id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

      var photo_id = req.params.photo_id;

      var selectValue = [
        'comment.user_id',
        'comment.board_id',
        'comment.comment_id',
        'comment.content',
        'comment.created',
        'users.username',
        'users.profile_image'
      ];

      var selectSql = 'select ?? from users inner join comment on users.user_id = comment.user_id where photo_id = ?';
      // 로그인 안 했을 때
            connection.query(selectSql,[selectValue, photo_id], function (err, result, next) {
              if(err){
                res.json(err);
              } else {
                if(!result){
                  res.json({success:false, mesage:"댓글을 불러오지 못 하였습니다."});
                } else {
                  res.json({success:true, message:"성공적으로 댓글을 불러왔습니다.", result: result});
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

router.post('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {


          var insertValue = {
            user_id: req.body.user_id,
            photo_id: req.body.photo_id,
            board_id: req.body.board_id,
  					content: req.body.comment
  				};
  				var insertSql = 'INSERT INTO comment set ?';
            //Incsert a record.
    					connection.query(insertSql, insertValue, function(err, result, next){
              if(err) {
                res.json({success:false, message:err});
              }
    					else {
                // 빈칸일 때 오류 잡기
                res.json({success:true, message:"댓글이 정상 등록되었습니다."});
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
				var dropRecord = 'DELETE FROM comment where comment_id = ?';
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



module.exports = router;




//
// // 갤러리 댓글
//         if(req.query.photo_id){
//
//         var photo_id = req.query.photo_id;
//         var selectSql1 = 'select ?? from users inner join comment on users.user_id = comment.user_id where photo_id = ?';
//         // 로그인 안 했을 때
//           if(!req.headers['x-auth']){
//               connection.query(selectSql1,[selectValue, photo_id], function (err, result, next) {
//                 if(err) {
//                   res.send(err);
//                 } else {
//                   var i = 0;
//                   var userComment = false;
//                   for(i; i<result.length; i++){
//                     result[i] = [result[i], userComment];
//                   }
//                   res.status(201).send([result, {success:true, message:'댓글을 정상적으로 불러왔습니다.'}]);
//                 }
//             });
//           }
//           // 로그인 했을 떄
//           else {
//           connection.query(selectSql1,[selectValue, photo_id], function (err, result, next) {
//           if(err) {
//             res.send(err);
//           }
//           else {
//           // 사용자가 작성한 댓글이 있는지 검사 후 전송
//           // 사용자 아이디와 작성한 아이디가 일치하면 True 전송 아니면 False 전송
//             var i = 0;
//               for(i; i<result.length; i++){
//                 var userComment = false;
//                 if(result[i].user_id === req.auth.user_id)
//                 {
//                   userComment = true;
//                   result[i] = [result[i], userComment];
//                 } else {
//                   userComment = false;
//                   result[i] = [result[i], userComment];
//                 }
//               }
//             res.status(201).send([result, {success:true, message:'댓글을 정상적으로 불러왔습니다.'}]);
//             }
//           });
//           }
//         }
//
//
// // 게시판 댓글
//         else if(req.query.board_id) {
//           var board_id = req.query.board_id;
//           var selectSql2 = 'select ?? from users inner join comment on users.user_id = comment.user_id where board_id = ?';
//           // 로그인 안 했을 때
//                   if(!req.headers['x-auth']){
//                       connection.query(selectSql2,[selectValue, board_id], function (err, result, next) {
//                       if(err) {
//                         res.send(err);
//                       } else {
//                         var i = 0;
//                         var userComment = false;
//                         for(i; i<result.length; i++){
//                           result[i] = [result[i], userComment];
//                         }
//                         res.status(201).send([result, {success:true, message:'댓글을 정상적으로 불러왔습니다.'}]);
//                       }
//                     });
//                   }
//           // 로그인 했을 떄
//                   else {
//                     connection.query(selectSql2,[selectValue, board_id], function (err, result, next) {
//                     if(err) {
//                       res.send(err);
//                     }
//                     else {
//           // 사용자가 작성한 댓글이 있는지 검사 후 전송
//           // 사용자 아이디와 작성한 아이디가 일치하면 True 전송 아니면 False 전송
//                       var i = 0;
//                       for(i; i<result.length; i++){
//                         var userComment = false;
//                         if(result[i].user_id === req.auth.user_id)
//                         {
//                           userComment = true;
//                           result[i] = [result[i], userComment];
//                         } else {
//                           userComment = false;
//                           result[i] = [result[i], userComment];
//                         }
//
//                       }
//                       res.status(201).send([result, {success:true, message:'댓글을 정상적으로 불러왔습니다.'}]);
//                       }
//                   });
//                   }
//
//         } else {
//         }
