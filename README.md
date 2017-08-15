# 캘리칼로스(CALLIKALLOS) 프로젝트
손 글씨를 좋아하는 사람들을 위한 웹 어플리케이션, 사용자가 손쉽게 자신의 작품을 업로드하고 관리하여 작품을 공유할 수 있도록 기획

# 사용된 오픈소스
angular-ui.router, angular-ui-cropper, summernote.js, nodemailer, nodemailer-sendgrid, angular-ui-bootstrap

# 웹을 구동시키기위해 읽어 볼 것
개인정보 보호를 위해 데이터베이스 정보, nodemailer-sendrid, json-webtoken을 모듈화하여 분리<br>
../mysql.js, ../controllers/api/privacy/email.js, ../controllers/api/privacy/config.js 파일 필요

<pre><code>
mysql.js
module.exports = {
  host     : 'localhost',<br>
  user     : 'mysql 아이디',<br>
  password : 'mysql 비밀번호',<br>
  database : '데이터베이스 이름'
};

email.js
module.exports = {
  api_user : 'sendgrid 아이디',
  api_key : 'sendgrid 비밀번호'
};

config.js
module.exports = {
   secret: '사용자 정의 문자'
};
</code></pre>
