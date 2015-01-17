angular.module('pages.route-config', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/network-summary');
    $stateProvider.state('sensors', {
        url: '/sensors',
        templateUrl: 'src/pages/sensors-page/sensors-page.html'
    }).state('network-summary', {
        url: '/network-summary',
        templateUrl: 'src/pages/network-summary/network-summary.html'
    }).state('login', {
        url: '/login',
        templateUrl: 'src/pages/login-page/login-page.html'
    });
});