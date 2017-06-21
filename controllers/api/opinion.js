var router = require('express').Router();

router.get('/:id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

        var id = req.params.id;
        // select agree board_id from comment user_id = user_id;
        var selectSql = 'select B.*, (select count(*) from comment where board_id = B.board_id) as comment_count, (select count(*) from opinion where board_id = B.board_id) as opinion_count from board B where board_id  = ?';
				//Select a record.
          connection.query(selectSql, [id],function (err, result, next) {
					if(err) throw err;
					else {

            res.status(201).send([result, {success: true, message: '데이터를 전송하였습니다.'}]);

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
          user_id: req.auth.user_id,
          board_id: req.body.board_id,
          agree:'1',
        };
        var insertSql = 'insert into opinion set ?;';
				//Select a record.
          connection.query(insertSql,[insertValue], function (err, result, next) {
					if(err) throw err;
					else {
						console.log('opinion 등록되었습니다.');
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

router.delete('/:id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var board_id = req.params.id;
				var dropRecord = 'delete from opinion where board_id = ?';
				connection.query(dropRecord, [board_id], function(err, result, next){
					if(err){
						res.send(err);
					}
					else{
						console.log('opinion 삭제되었습니다.');
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
