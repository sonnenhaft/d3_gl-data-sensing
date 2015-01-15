angular.module('graph.chart-tooltip', [
    'graph.d3-wrapper'
]).directive('chartTooltip', function(d3){
    var DURATION = 500;
    return {
        templateNamespace: 'svg',
        replace: true,
        scope: {
            height: '=',
            closestDot: '='
        },
        templateUrl: 'src/graph/chart-tooltip/chart-tooltip.html',
        link: function($scope, $element){
            var d3svg = d3.selectAll($element);
            var $ = d3svg.selectAll.bind(d3svg);
            var widthLine = $('.w');
            var heightLine = $('.h');
            var circle = $('circle');
            var textY = $('.ty');
            var textX = $('.tx');

            $scope.$watch('closestDot', function(closestDot){
                if (!closestDot){
                    d3svg.attr('visibility', 'hidden');
                    return;
                } else {
                    d3svg.attr('visibility', 'visible');
                }
                var dot = closestDot[0];
                var dataDot = closestDot[1];
                d3svg.transition().duration(DURATION).each(function () {
                    widthLine.attr({x1: 0}).transition()
                        .attr({x2: dot.x, y1: dot.y, y2: dot.y});
                    heightLine.attr({y1: $scope.height}).transition()
                        .attr({x1: dot.x, x2: dot.x, y2: dot.y});
                    circle.transition().attr({cx: dot.x, cy: dot.y});
                    textY.transition().attr({y: dot.y}).text(dataDot.y);
                    textX.transition().attr({x: dot.x}).text(dataDot.x);
                });
            }, true);
        }
    };
});