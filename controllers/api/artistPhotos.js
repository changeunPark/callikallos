var router = require('express').Router();

router.get('/:artist_id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var selectSql = 'select B.*,  (select description from photo_type where code = B.photo_type) as description from my_photos B where user_id = ?';
        var selectValue = req.params.artist_id;

          connection.query(selectSql, selectValue, function (err, result, next) {
          if(err){
    						res.send(err);
          }
					else {
            if(!result){
              res.status(201).send({success:false, message:'작품을 불러오지 못 하였습니다.'});
            } else {
              res.status(201).send({success:true, message:'작품을 성공적으로 불러왔습니다.', result: result});
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
