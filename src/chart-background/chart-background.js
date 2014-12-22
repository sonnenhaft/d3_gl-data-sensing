angular.module('chart-background', [
    'area-chart'
]).directive('chartBackground', function () {
    return {
        transclude: true,
        scope: {values: '=?', axisOutline: '=?'},
        templateUrl: 'src/chart-background/chart-background.html'
    };
});