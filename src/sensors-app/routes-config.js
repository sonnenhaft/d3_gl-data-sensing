angular.module('sensors-app').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/sensors');
    $stateProvider.state('sensors', {
        url: '/sensors',
        templateUrl: 'src/sensors-app/sensors-app.html'
    }).state('login', {
        url: '/login',
        templateUrl: 'src/login-page/login-page.html'
    });
});