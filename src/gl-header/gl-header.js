angular.module('header', [
    'ui.router'
]).directive('header', function ($rootScope, $window) {
    return {
        templateUrl: 'src/gl-header/gl-header.html',
        link: function($scope){
            $scope.goBack = function(){
                $window.history.back();
            }
        }
    };
});