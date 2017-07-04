var router = require('express').Router();


// 게시물에 해당한는 전체 댓글 가져오는 API
router.get('/:board_id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

      var board_id = req.params.board_id;

      var selectValue = [
        'comment.user_id',
        'comment.board_id',
        'comment.comment_id',
        'comment.content',
        'comment.created',
        'users.username',
        'users.profile_image'
      ];

      var selectSql = 'select ?? from users inner join comment on users.user_id = comment.user_id where board_id = ?';
      // 로그인 안 했을 때
            connection.query(selectSql,[selectValue, board_id], function (err, result, next) {
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



module.exports = router;
