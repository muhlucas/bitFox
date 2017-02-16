angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('page', {
    cache: false,
    url: '/page1',
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
  })

      .state('flappybird', {
    cache: false,
    url: '/flappybird',
    templateUrl: 'templates/flappybird.html',
    controller: 'flappybirdCtrl'
  })

  .state('page2', {
    cache: false,
    url: '/page2',
    templateUrl: 'templates/page2.html',
    controller: 'page2Ctrl'
  })

  .state('acertoPage', {
    cache: false,
    url: '/acertoPage',
    templateUrl: 'templates/acertoPage.html',
    controller: 'acertoPageCtrl'
  })

  .state('homeCourse', {
    cache: false,
    url: '/homeCourse',
    templateUrl: 'templates/homeCourse.html',
    controller: 'homeCourseCtrl'
  })  

$urlRouterProvider.otherwise('/page1')

  

});