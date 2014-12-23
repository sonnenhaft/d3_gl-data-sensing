angular.module('volume-usage-graph', [
    '3rd-party-libs'
]).directive('volumeUsageGraph', function (d3, $window) {

    function getWidth($element) {
        return $element.parent().prop('clientWidth');
    }

    return {
        transclude: true,
        scope: {values: '=?', axisOutline: '=?'},
        templateUrl: 'src/volume-usage-graph/volume-usage-graph.html',
        link: function ($scope, $element) {
        }
    };
});