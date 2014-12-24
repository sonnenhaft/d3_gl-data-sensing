angular.module('sensors-app').directive('devVersion', function($http){
    return {
        link: function($scope){
            $http.get('package.json').success(function(pkg) {
                $scope.version = ' v' + pkg.version;
            });
        },
        template: '{{version}}'
    };
});