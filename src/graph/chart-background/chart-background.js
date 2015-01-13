angular.module('graph.chart-background', [
    'graph.area-chart'
]).directive('graph.chartBackground', function () {
    return {
        transclude: true,
        scope: {values: '=?', axisOutline: '=?'},
        templateUrl: 'src/graph/chart-background/chart-background.html'
    };
});