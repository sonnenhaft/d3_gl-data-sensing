angular.module('components.monthly-usage-chart', [
    'graph.area-chart'
]).directive('monthlyUsageChart', function () {
    return {
        templateUrl: 'src/components/monthly-usage-chart/monthly-usage-chart.html'
    };
});