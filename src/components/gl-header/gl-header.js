angular.module('components.gl-header', [
    'ui.router'
]).directive('glHeader', function ($rootScope, $window) {
    return {
        templateUrl: 'src/components/gl-header/gl-header.html',
        link: function($scope){
            $scope.goBack = function(){
                $window.history.back();
            };
        }
    };
});