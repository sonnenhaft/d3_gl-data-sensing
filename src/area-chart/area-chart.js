angular.module('area-chart', [
    '3rd-party-libs'
]).directive('areaChart', function (d3, $window) {
    return {
        transclude: true,
        scope: {values: '=?'},
        templateUrl: 'src/area-chart/area-chart.html',
        link: function ($scope, $element) {
            var d3svg = d3.selectAll($element).select('svg');
            var $ = d3svg.select.bind(d3svg);
            $scope.$watch('values', function (data) {
                paintChart(data, $element.parent().prop('clientWidth'));
            }, true);

            var height = d3svg.attr('height') - 30;
            $scope.padding = 2;

            angular.element($window).bind('resize', function () {
                if ($scope.values) {
                    paintChart($scope.values, $element.parent().prop('clientWidth'), true);
                    $scope.$digest();
                }
            });


            function paintChart(data, width, disableAnimation) {
                $scope.width = width;
                width = width - $scope.padding * 2;
                var values = d3.values(data);
                var keys = d3.keys(data);

                var maxValue = d3.max(values);

                var xScale = d3.scale.ordinal().domain(keys).rangePoints([0, width]);
                var yScale = d3.scale.linear().domain([maxValue * 1.1, 0]).range([0, height]);
                var maxVal = 100;
                var xScale1 = d3.scale.linear().domain([0, maxVal]).range([0, width]);

                function x(ignored, index) {
                    return index * width / (values.length - 1);
                }

                function x1(ignored, index) {
                    return x(ignored, index + 1);
                }

                function y(item) {
                    return yScale(item);
                }

                d3svg.transition().ease('linear').duration(disableAnimation ? 0 : 750).each(function () {
                    var xAxis = d3.svg.axis().scale(xScale).tickFormat(function (d, i) {
                        return i == keys.length - 1 || i == 0 ? '' : d;
                    });
                    var xAxis1 = d3.svg.axis().scale(xScale1).ticks(values.length * 1.5).tickFormat(function (d, i) {
                        return d == maxVal || i == 0 ? '' : d;
                    }).tickSize(5, 0);
                    //$('g.x-axis').call(xAxis).attr({transform: 'translate(0,' + height + ')'});
                    $('g.x-axis').call(xAxis1).attr({transform: 'translate(0,' + height + ')'});

                    var yAxis = d3.svg.axis().scale(yScale).ticks(8).orient('left').tickSize(-width, 0, 0);

                    $('g.y-axis').transition().call(yAxis).selectAll("text")
                        .tween("attr.x", null)
                        .attr({y: -10, x: 20, style: 'text-anchor:middle'});

                    var area = d3.svg.area()
                        .x(x).y0(height).y1(y);
                    $('path.transparent-area').transition().attr('d', area(values));

                    var lineFunction = d3.svg.line().x(x).y(y);
                    $('path.chart-line').transition().attr('d', lineFunction(values));

                    var vals = values.slice(1, values.length);
                    vals.pop();
                    $('g.white-dots').drtEnter(vals, 'circle', {r: 6, cx: x1, fill: 'white'})
                        .transition().attr({cx: x1, cy: y});
                });
            }
        }
    };
});