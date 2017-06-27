angular.module('app',[
    'ui.router',
    'ui.bootstrap',
    'userControllers',
    'mainControllers',
    'emailControllers',
    'artistControllers',
    'ngImgCrop'
]).config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptors');
});
