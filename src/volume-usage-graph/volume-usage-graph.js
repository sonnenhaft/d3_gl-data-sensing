angular.module('volume-usage-graph', [
    '3rd-party-libs'
]).directive('volumeUsageGraph', function (d3, $window) {
    var id = 0;
    return {
        transclude: true,
        scope: {values: '=?'},
        templateUrl: 'src/volume-usage-graph/volume-usage-graph.html',
        link: function ($scope, $element) {
            if (!$scope.values) {
                $scope.values = [];
            }
            var svg = d3.selectAll($element).selectAll('svg');

            $scope.id = id++;
            var zoomListener = d3.behavior.zoom().scale(.5).scaleExtent([0, 1]).on("zoom", zoom);

            svg.call(zoomListener);

            var mask = svg.selectAll('svg g.rects');

            function zoom() {
                var h = ($scope.lineHeight + 1) * ( $scope.values.length) - $scope.height;
                var scale = d3.event.scale - 0.5;
                mask.attr("transform", "translate(0," + scale * h + ")");
            }

            $scope.$watch('values', function () {
                var barWidth = $scope.width - $scope.textWidth;
                function y(d, i) {return ($scope.lineHeight + 1) * i;}
                function w(d, i) {return barWidth * d / 100;}
                function x(d, i) {return w(d, i) / d * (100 - d) / 2;}

                svg.select('.rectsClip').drtEnter($scope.values, 'rect', {width:0, x: barWidth/2})
                    .attr({y: y, rx: 10, ry: 10, height: $scope.lineHeight})
                    .transition().ease('linear').duration(2500)
                    .attr({width: w, x: x});

                zoomListener.scale(.5).event(svg);
            });

            function getWidth($element) {
                return $element.parent().prop('clientWidth');
            }

            angular.element($window).bind('resize', function () {
                $scope.width = getWidth($element);
                $scope.$digest();
            });
            $scope.width = getWidth($element);
        }
    };
});