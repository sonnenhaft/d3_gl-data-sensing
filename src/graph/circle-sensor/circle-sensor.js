angular.module('graph.circle-sensor', [
    '3rd-party-libs'
]).directive('circleSensor', function (d3) {
    var DEFAULT_ARC_ANGLE = Math.PI / 2;
    var OUTER_RADIUS = 50;
    var INNER_RADIUS = OUTER_RADIUS - 6;

    var arcFn = d3.svg.arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(OUTER_RADIUS);

    function rotateArc(transition, startAngle) {
        transition.attrTween('d', function (d) {
            var i = d3.interpolate(d.startAngle, startAngle);
            return function (t) {
                d.startAngle = i(t);
                d.endAngle = d.startAngle + DEFAULT_ARC_ANGLE;
                return arcFn(d);
            };
        });
    }

    function rotateOnAngle(angle) {
        var elem = d3.select(this);
        var i = d3.interpolate(elem.attr('angle') - 0, angle - 45);
        elem.attr('angle', angle - 45);
        return function (t) {
            return 'rotate(' + i(t) + ',0,'+ OUTER_RADIUS +')';
        };
    }

    return {
        transclude: true,
        scope: {angle: '=?', label: '@', time: '@', scale: '@'},
        templateUrl: 'src/graph/circle-sensor/circle-sensor.html',
        link: function ($scope, $element) {
            if ($scope.scale) {
                $scope.scale = parseInt($scope.scale);
            } else {
                $scope.scale = 1;
            }
            var d3svg = d3.selectAll($element).select('svg');
            var $ = d3svg.select.bind(d3svg);

            $('path.blue-circle').attr('d', arcFn({
                endAngle: Math.PI * 2,
                startAngle: 0
            }));

            var whiteDot = $('circle').attr('angle', -45);
            var circle = $('path.grey-circle').datum({
                startAngle: 0,
                endAngle: DEFAULT_ARC_ANGLE
            }).attr('d', arcFn);

            $scope.$watch('angle', function (angle) {
                var angleRadians = angle * Math.PI * 2 / 360;
                d3svg.transition().ease('linear').duration(1500).each(function () {
                    whiteDot.datum(angle).transition().attrTween('transform', rotateOnAngle);
                    circle.transition().call(rotateArc, angleRadians);
                });
            });
        }
    };
});