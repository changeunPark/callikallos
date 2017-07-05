var app = angular.module('app');
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
$urlRouterProvider.otherwise('/');
// $locationProvider.html5Mode(true);

 $stateProvider
           .state('app', {
             url: '/',
             views:{
               'header': {
               templateUrl: '/menues/mainMenu.html',
               controller: 'mainMenuController'
               },
               'content': {
               templateUrl: '/main/home.html'
               },
               'footer': {
               templateUrl: '/company/footer.html'
               }
             }
            })

            .state('management', {
              url:'/management',
              templateUrl: '/management/management.html',
              controller: 'managementCtrl',
              controllerAs: 'management',
              permission: 'admin'
            })

            .state('registerStep1',
             {
               url: '/register/step1',
               controller: 'regCtrl',
               controllerAs: 'register',
               templateUrl: '/isLoggedOut/registerStep1.html',
               authenticated: false
            })

            .state('registerStep2',
             {
               url: '/register/step2',
               controller: 'regCtrl',
               controllerAs: 'register',
               templateUrl: '/isLoggedOut/registerStep2.html',
               authenticated: false
            })


            .state('resetusername',
            {
              url: '/resetusername',
              templateUrl: '/users/reset/username.html',
              controller: 'usernameCtrl',
              controllerAs: 'username'
            })

            .state('resetpassword',
            {
              url: '/resetpassword',
              templateUrl: '/users/reset/password.html',
              controller: 'passwordCtrl',
              controllerAs: 'password'
            })

            .state('reset',
            {
              url: '/reset/:token',
              templateUrl: '/users/reset/newpassword.html',
              controller: 'resetCtrl',
              controllerAs: 'reset'
            })


            .state('activate',
            {
              url: '/activate/:token',
              templateUrl: '/users/activation/activate.html',
              controller: 'emailCtrl',
              controllerAs: 'email'
            })

            .state('resend',
            {
              url: '/resend',
              templateUrl: '/users/activation/resend.html',
              controller: 'resendCtrl',
              controllerAs: 'resend'
            })



  // 유저 프로필 모아 놓은 곳  / 계정 정보
           .state('app.profiles', {
             url: 'profiles',
             views:{
               'content@': {
                templateUrl: 'isLoggedIn/userProfiles.html',
                controller: 'profileCtrl',
                controllerAs: 'profile',
                authenticated: false
               }
             }
            })

// 작가 작품 모아 놓은 곳
          .state('app.photos', {
            url: 'photos',
            views:{
              'content@': {
                templateUrl: 'isLoggedIn/artistPhotos.html',
                controller: 'anArtistPhotoCtrl',
                controllerAs: 'anArtistPhoto',
                authenticated: false
              }
            }
           })

// 등록된 작가의 작품 업로드 & 작가 프로필
           .state('app.artistProfiles', {
             url: 'artist',
             views:{
               'content@': {
                templateUrl: 'isLoggedIn/artistProfiles.html',
                controller: 'artistProfileCtrl',
                controllerAs: 'artistProfile',
                authenticated: true
               }
             }
            })

            .state('app.intro',
            {
              url: 'intro',
              views:{
                'content@': {
                  templateUrl: '/company/intro.html',
                  authenticated: false
                }
              }
            })

            .state('app.terms',
            {
              url: 'terms',
              views:{
                'content@': {
                  templateUrl: '/company/terms.html',
                  authenticated: false
                }
              }
            })

            .state('app.privacy',
            {
              url: 'privacy',
              views:{
                'content@': {
                  templateUrl: '/company/privacy.html',
                  authenticated: false
                }
              }
            })


// ==================  artist / gallery / exhibition / board ============================ //
// ==================  artist 카테고리 ============================ //

            .state('app.artist', {
              url: 'artist/category=:code',
              views:{
                'content@': {
                  templateUrl: '/main/form.html'
                },
                'menu@app.artist':{
                  templateUrl: '/partialArtist/artistTap.html',
                  controller: 'artistTapCtrl',
                  controllerAs: 'artistTap',
                  authenticated: false
                },
                'contents@app.artist':{
                  templateUrl: '/partialArtist/artists.html',
                  controller: 'artistsCtrl',
                  controllerAs: 'artists',
                  authenticated: false
                }
              }
             })

             .state('app.gallery', {
               url: 'gallery/category=:code',
               views:{
                 'content@': {
                   templateUrl: '/main/form.html'
                 },
                 'menu@app.gallery':{
                   templateUrl: '/partialGallery/galleryTap.html',
                   controller: 'galleryTapCtrl',
                   controllerAs: 'galleryTap'
                 },
                 'contents@app.gallery':{
                   templateUrl: '/partialGallery/photos.html',
                   controller: 'galleryPhotosCtrl',
                   controllerAs: 'galleryPhotos',
                   authenticated: false
                 }
               }
              })

              .state('app.board', {
                url: 'board/category=:code',
                views:{
                  'content@': {
                    templateUrl: '/main/form.html'
                  },
                  'menu@app.board':{
                    templateUrl: '/partialBoard/boardTap.html',
                    controller: 'boardTapCtrl',
                    authenticated: false
                  },
                  'contents@app.board':{
                    templateUrl: '/partialBoard/boards.html',
                    controller: 'boardsCtrl',
                    controllerAs: 'boards',
                    authenticated: false
                  }
                }
               })

             .state('app.display', {
               url: 'display/category=:code',
               views:{
                 'content@': {
                   templateUrl: '/main/form.html'
                 },
                 'menu@app.display':{
                   templateUrl: '/partialDisplay/displayTap.html',
                   controller: 'displayMenuController',
                   authenticated: false
                 },
                 'contents@app.display':{
                   templateUrl: '/partialDisplay/content.html',
                   controller: 'displayMenuController',
                   authenticated: false
                 }
               }
              })

             .state('app.artist.show', {
               url: '/artist:artist_id',
               views:{
                 'contents@app.artist':{
                   templateUrl: '/partialArtist/artist.html',
                   controller: 'artistPhotoCtrl',
                   controllerAs: 'artistPhoto',
                   authenticated: false
                 }
               }
              })

           .state('app.gallery.show', {
             url: '/photo_type=:photo_type/photo:photo_id',
             views:{
               'contents@app.gallery':{
                 templateUrl: '/partialGallery/photo.html',
                 controller: 'galleryPhotoCtrl',
                 controllerAs: 'galleryphoto',
               }
             }
            })

           .state('app.board.show',
           {
             url: '/board:board_id',
             views:{
               'contents@app.board':{
                 templateUrl: 'partialBoard/board.html',
                 controller: 'boardCtrl',
                 controllerAs: 'board',
               }
             }
           })


            .state('app.board.create',
            {
              url:'/create',
              views:{
                'contents@app.board':{
                  templateUrl:'/partialBoard/boardCreate.html',
                  controller: 'boardCtrl',
                  controllerAs: 'board',
                  authenticated: true
                }
              }
            })


           .state('app.board.edit',
           {
             url: '/edit/:board_id',
             views:{
               'contents@app.board':{
               templateUrl: 'partialBoard/boardUpdate.html',
               controller: 'boardCtrl',
               controllerAs: 'board',
               authenticated: true
             }
           }
         })

         .state('app.gallery.edit', {
           url: '/edit/:photo_id',
           views:{
             'content@':{
               templateUrl: '/partialGallery/photoEdit.html',
               controller: 'galleryPhotoCtrl',
               controllerAs: 'galleryphoto',
             }
           }
         });

});

app.run(function($rootScope, User, $state){
  $rootScope.$on('$stateChangeStart',  function(event, toState, toParams, fromState, fromParams, options){
    if(toState.permission === 'admin'){
      User.getPermission().then(function(data){
      });
    } else {
    }
  });
  $rootScope.$on('$stateChangeError',  function(event, toState, toParams, fromState, fromParams, error){
    $state.go('app');
  });
});
