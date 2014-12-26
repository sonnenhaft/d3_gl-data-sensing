angular.module('area-chart', [
    '3rd-party-libs'
]).directive('areaChart', function (d3, $window, d3WrapperService) {
    var PADDING_BOTTOM = 25;

    return {
        transclude: true,
        scope: {values: '=?', axisOutline: '=?'},
        templateUrl: 'src/area-chart/area-chart.html',
        link: function ($scope, $element) {
            var isOutlineAxis = !$scope.axisOutline;
            var $ = d3WrapperService.wrap($element);


            $scope.$watch('values', function (data) {
                paintChart(data, $.parentWidth());
            }, true);

            angular.element($window).bind('resize', function () {
                if ($scope.values) {
                    paintChart($scope.values, $.parentWidth(), true);
                    $scope.$digest();
                }
            });

            var rightPadding;
            $scope.PADDING_TOP = 18;
            

            if (isOutlineAxis) {
                rightPadding = 2;
                $scope.leftPadding = rightPadding;
            } else {
                rightPadding = 12;
                $scope.leftPadding = rightPadding * 3;
            }


            var height = $.height() - $scope.PADDING_TOP - PADDING_BOTTOM;
            $scope.height = height;

            function paintChart(data, width, disableAnimation) {
                $scope.width = width;
                width = width - rightPadding - $scope.leftPadding;
                var values = d3.values(data);
                var maxKeyVal = 100;
                var yScale = d3.scale.linear().domain([d3.max(values) * 1.2, 0]).range([0, height]);
                var xScale = d3.scale.linear().domain([0, maxKeyVal]).range([0, width]);

                var xAxis = d3.svg.axis().scale(xScale).ticks(values.length * 1.5).tickSize(5, -height);
                if (isOutlineAxis) {
                    xAxis.tickSize(5, 0).tickFormat(function (d, i) {
                        return d === maxKeyVal || i === 0 ? '' : d;
                    });
                }
                var yAxis = d3.svg.axis().scale(yScale).ticks(6).orient('left').tickSize(-width, 0, 0).tickPadding(8);

                $.linearTransition(disableAnimation ? 0 : 750, function () {
                    var xPath = $('g.x-axis').transition().call(xAxis).select('path');
                    var yText = $('g.y-axis').transition().call(yAxis).selectAll('text');

                    function y(item) {return yScale(item);}
                    function x(ignored, index) {return index * width / (values.length - 1);}
                    var pathArea = d3.svg.area().x(x).y0(height).y1(y)(values);

                    $('path.transparent-area').transition().attr('d', pathArea);

                    var dotX = x;
                    var dotValues = values;
                    if (isOutlineAxis) {
                        xPath.select('path').attr({opacity: 0.5});
                        yText.tween('attr.x', null).attr({y: -10, x: 20, style: 'text-anchor:middle'});
                        pathArea = d3.svg.line().x(x).y(y)(values);
                        dotValues = values.slice(1, values.length);
                        dotValues.pop();
                        dotX = function xPlusOne(ignored, index) {return x(ignored, index + 1);};
                    }

                    $('path.transparent-area-border').transition().attr('d', pathArea);
                    $('g.white-dots').drtEnter(dotValues, 'circle', {r: 6, cx: dotX, fill: 'white'})
                        .transition().attr({cx: dotX, cy: y});
                });
            }
        }
    };
});