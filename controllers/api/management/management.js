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

        var selectSql = 'select permission from users where user_id =?';
        var selectValue = req.decoded.user_id;

          connection.query(selectSql, selectValue, function (err, result, next) {
          if(err){
    						res.send(err);
          }
					else {
            if(!result){
              res.status(201).send({success:false, message:'정보를 불러오지못하였습니다.'});
            } else {
              res.status(201).send({success:true, message:'정보를 불러왔습니다.', permission: result[0].permission});
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
