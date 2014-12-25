angular.module('live-chart', [
    '3rd-party-libs'
]).directive('liveChart', function (d3, $window, $interval, d3WrapperService) {
    var STACK_SIZE = 150;
    var DEFAULT_DATA = [];
    for (var i = 0; i < 25; i++) {
        DEFAULT_DATA.push({x: i, y: Math.random() * 350});
    }
    var DURATION = 500;
    var RIGHT_PADDING = 12;
    var PADDING_BOTTOM = 25;

    var id = 0;

    return {
        transclude: true,
        scope: {values: '=?'},
        templateUrl: 'src/live-chart/live-chart.html',
        link: function ($scope, $element) {
            var $ = d3WrapperService.wrap($element);

            $scope.id = id++;

            $scope.$watch('values', function (data) {
                paintChart(data, $.parentWidth());
            }, true);

            angular.element($window).bind('resize', function () {
                if ($scope.values) {
                    paintChart($scope.values, $.parentWidth(), true);
                    $scope.$digest();
                }
            });

            $scope.LEFT_PADDING = RIGHT_PADDING * 3;
            $scope.PADDING_TOP = 18;

            var height = $.height()  - $scope.PADDING_TOP - PADDING_BOTTOM;
            $scope.height = height;
            var interval;

            function paintChart(data, width, disableAnimation) {
                data = DEFAULT_DATA;

                $scope.width = width;
                width = width - RIGHT_PADDING - $scope.LEFT_PADDING;
                $scope.pathWidth = width;

                function xScaleGen(toStack) {
                    var begin = !toStack ? 0 : data[data.length - STACK_SIZE].x;
                    return d3.scale.linear().domain([begin, data[data.length - 1].x]).range([0, width]);
                }

                function yScaleGen(values) {
                    return d3.scale.linear().domain([d3.max(values) * 1.2, 0]).range([0, height]);
                }

                var xAxis = d3.svg.axis().ticks(10).tickSize(-height, 0).tickPadding(8);
                var yAxis = d3.svg.axis().ticks(6).orient('left').tickSize(-width, 0, 0).tickPadding(8);
                var areaFn = d3.svg.area().y0(height).interpolate('basis');
                if (interval) {
                    $interval.cancel(interval);
                }
                interval = $interval(function () {renderLiveChart();}, 2 * DURATION);

                function renderLiveChart(disableAnimation) {
                    data.push({y: Math.round(Math.random() * 400), x: data[data.length - 1].x + 1});
                    console.log(data[data.length - 1])
                    $.linearTransition(disableAnimation ? 0 :DURATION, function () {
                        var toStack = STACK_SIZE < data.length;
                        var length = toStack ? STACK_SIZE : data.length;

                        function x(ignored, index) {return index * width / (length - 1);}

                        var values = data.map(function (i) {return i.y;});
                        var y = yScaleGen(values);
                        $('g.x-axis').transition().call(xAxis.scale(xScaleGen(toStack)));
                        $('g.y-axis').transition().call(yAxis.scale(y));
                        var dArea = areaFn.x(x).y1(y);
                        var transparentArea = $('path.transparent-area');
                        if (toStack) {
                            transparentArea
                                .attr({d: dArea(values), transform: null})
                                .transition()
                                .attr({transform: 'translate(' + x(0, -1) + ')'});
                            data.shift();
                        } else {
                            values.push(0);
                            transparentArea.transition().attr('d', dArea(values));
                        }
                    });
                }

                renderLiveChart(disableAnimation);
            }
        }
    };
});