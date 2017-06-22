angular.module('app')
.controller('ProfileController', function($scope, $http){

  $scope.data = {
   availableOptions: [
     {id: '0', name: '카테고리를 선택해주세요.'},
     {id: '1', name: '캘리그라피'},
     {id: '2', name: '서예'},
     {id: '3', name: '문인화'},
     {id: '4', name: '전각'},
     {id: '5', name: '음각'},
   ],
   selectedOption: {id: '0', name: '카테고리를 선택해주세요.'} //This sets the default value of the select in the ui
   };

   $scope.history = [];

  $scope.skills = [];
// $scope.skills가 객체 형태로 저장 됨 객체를 문자열로 바꾸어서 저장해야 함
  $scope.addSkill = function(response) {
    if($scope.skills.length > '4'){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '히스토리 등록은 5개로 제한됩니다.';
      // 5개 이상 추가 금지
    } else {
      if($scope.newSkill === undefined || $scope.newSkill === null || $scope.newSkill === ''){
        $scope.mainMessageStatus = true;
        $scope.alert = 'alert alert-danger';
        $scope.mainMessage = '히스토리를 입력해주세요.';
      } else {
        $scope.mainMessageStatus = true;
        $scope.skills.push({'title': $scope.newSkill, 'done':false});
        $scope.newSkill = '';
        $scope.history = $scope.skills;
      }
    }
  };

  $scope.deleteSkill = function(index) {
    $scope.skills.splice(index, 1);
  };


  $scope.getUserDetail = function(){
    $http.get('/api/myProfileTap2/').then(function(response){
      $scope.userInfo2 = response.data;
    });
  };

  $scope.insertUserDetail = function(response){
    if($scope.data.selectedOption.id === '0'){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '카테고리를 선택해주세요.';
    } else if(response.short_info === undefined || response.short_info === null || response.short_info === ''){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '한 줄 소개를 입력해주세요.';
    } else if(response.detail_info === undefined || response.detail_info === null || response.detail_info === ''){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '상세소개를 입력해주세요.';
    } else if(response.social_site === undefined || response.social_site === null || response.social_site === ''){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '대표 사이트를 입력해주세요.';
    } else if(response.public_email === undefined || response.public_email === null || response.public_email === ''){
      $scope.mainMessageStatus = true;
      $scope.alert = 'alert alert-danger';
      $scope.mainMessage = '공개 이메일을 입력해주세요.';
    } else {
      $http.put('/api/myProfileTap2/',
    {
      response:response, user_type: $scope.data.selectedOption.id
    }).then(function(response){
      if(response.data.success){
        $scope.mainMessageStatus = true;
        $scope.alert = 'alert alert-success';
        $scope.mainMessage = response.data.message;
      } else {
        $scope.mainMessageStatus = true;
        $scope.alert = 'alert alert-success';
        $scope.mainMessage = response;
      }
      });
    }
};



// my_profiles & my_photos
  $scope.getUserProfile= function(){
    $http.get('/api/myProfileTap1/').then(function(response){
// 작가 등록을 했을 때
      if(response.data.permission === 'admin' || response.data.permission === 'moderator'){
        $scope.checkboxModel = {
         value : true
        };
        $scope.userSetting = response.data;
      } else {
        $scope.checkboxModel = {
         value : false
        };
        $scope.userSetting = response.data;
      }
    });
};


// /사용자가 회원가입 후 작가 등록 한 경우 / 그리고 회원가입 중 작가 등록 한 경우
// 유저 개인정보 변경 함수
  $scope.updateUserInfo = function(){
    var enrolledArtist = $scope.checkboxModel.value;
    var permission = $scope.userSetting.permission;
    var responsedata = $scope.userSetting;
    var is_enrolled = $scope.userSetting.is_enrolled;

// 작가 등록한 경우
// is_enrolled는 작가 등록을 한번이라도 했을 때 1로 계속 유지 === my_profile 테이블의 컬럼이 존재
    if(enrolledArtist){
      if(is_enrolled){
        permission = 'moderator';
        $http.put('/api/myProfileTap1/', {
          permission : permission,
          response : responsedata,
          is_enrolled : '1'
        }).then(function(response){
// 전체 페이지를 새로고침
          $window.location.reload();
        });
      }

      else {
        UserSvc.created();
        permission = 'moderator';
        $http.put('/api/myProfileTap1/', {
          permission : permission,
          response : responsedata,
          is_enrolled : '1'
        }).then(function(response){
  // 전체 페이지를 새로고침
          $window.location.reload();
        });
      }
    }

// 작가 등록 취소 경우
      else {
      permission = 'user';

      $http.put('/api/myProfileTap1/', {
        permission : permission,
        response : responsedata,
        is_enrolled : '1'
      }).then(function(response){
        $window.location.reload();

      });
    }
  };

// 유저 프로필 사진 변경 함수
  $scope.file = {};
  $scope.photoChanged = function(files) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = e.target.result;
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    };


// 프로필 이미지를 업데이트하는 함수
    $scope.updateProfileImage = function(){
        $scope.$emit('LOAD');
        var fd = new FormData();
        fd.append('myfile', $scope.file.upload);
          $http.put('/api/myProfileImage/', fd,{
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).then(function(data){
          if (data.data.success) {
              $scope.$emit('UNLOAD');
              $scope.alert = 'alert alert-success';
              $scope.message = data.data.message;
              $scope.file = {};
          } else {
              $scope.$emit('UNLOAD');
              $scope.alert = 'alert alert-danger';
              $scope.message = data.data.message;
              $scope.file = {};
            }
          });
        };

});
