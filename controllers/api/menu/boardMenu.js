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
            console.log(req.body);
              if(req.body.title === undefined || req.body.title === null || req.body.title === '' || req.body.content === undefined || req.body.content === null || req.body.content === '')
              {
                res.status(401).send({success: false, message: '올바르지 않은 정보입니다.'});
              } else {

                var insertValue = {
                  user_id: req.body.user_id,
                  title: req.body.title,
                  content: req.body.content,
                  board_type:req.body.board_type
                };

                var insertSql = 'INSERT INTO board set ?';

                connection.query(insertSql, insertValue, function(err, result, next){
                  if(err){
                      res.send(err);
                  }
                else {
                  if(!result){
                    res.status(201).send({success: false, message: '올바른 정보를 입력해주세요.'});
                  } else {
                    res.status(201).send({success: true, message: '게시물이 정상 등록되었습니다..'});
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

router.get('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

        var selectSql = 'select * from board_type';
				//Select a record.
          connection.query(selectSql, function (err, result, next) {
          if(err){
            console.error('SQL error: ', err);
            return next(err);
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

router.get('/:board_type', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var board_type = req.params.board_type;
        var selectSql = 'select B.*,  (select username from users where user_id = B.user_id) as username, (select count(*) from comment where board_id = B.board_id) as comment_count, (select count(*) from opinion where board_id = B.board_id) as opinion_count, (select description from board_type where code = B.board_type) as description from board B where board_type = ?;';

        if(board_type === '0'){
             selectSql = 'select B.*,  (select username from users where user_id = B.user_id) as username, (select count(*) from comment where board_id = B.board_id) as comment_count, (select count(*) from opinion where board_id = B.board_id) as opinion_count, (select description from board_type where code = B.board_type) as description from board B';
              connection.query(selectSql, board_type, function (err, result, next) {
              if(err){
                    res.send(err);
              }
              else {
                if(!result){
                  res.json({success:false, message:'정보를 불러오지 못하였습니다.'});
                } else {
                  res.json({success:true, message:'정보를 불러왔습니다.', result:result});
                }
              }
            });
        } else {
            connection.query(selectSql, board_type, function (err, result, next) {
            if(err){
                  res.send(err);
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
      }
  });
}
catch(ex){
  console.error("Internal error: "+ex);
  return next(ex);
}
});

module.exports = router;
