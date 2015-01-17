angular.module('components.clock', [
]).directive('clock', function ($interval) {
    return {
        template: '{{time | date : "hh:mm:ss a"}}',
        link: function($scope){
            $scope.time = new Date();
            $interval(function setTime(){
                $scope.time = new Date();
            }, 1000)
        }
    };
});