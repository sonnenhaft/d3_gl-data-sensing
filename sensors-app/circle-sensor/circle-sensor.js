angular.module('circle-sensor', [
    '3rd-party-libs'
]).directive('circleSensor', function (d3) {
    var DEFAULT_ARC_ANGLE = Math.PI / 2;
    var OUTER_RADIUS = 50;
    var INNER_RADIUS = OUTER_RADIUS - 6;
    var ARC_FN = d3.svg.arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(OUTER_RADIUS);

    function arcTween(transition, startAngle) {
        transition.attrTween('d', function (d) {
            var i = d3.interpolate(d.startAngle, startAngle);
            return function (t) {
                d.startAngle = i(t);
                d.endAngle = d.startAngle + DEFAULT_ARC_ANGLE;
                return ARC_FN(d);
            };
        });
    }

    //function textTween(d) {
    //    var i = d3.interpolateRound(this.textContent - 0, d);
    //    return function (t) {this.textContent = i(t);};
    //}

    function rotateFn(angle) {
        var elem = d3.select(this);
        var prevAngle = elem.attr('angle') - 0;
        var i = d3.interpolate(prevAngle, angle - 45);
        elem.attr('angle', angle - 45);
        return function (t) {
            return 'rotate(' + i(t) + ',0,50)';
        };
    }

    return {
        scope: {
            angle: '=?',
            text: '=?',
            label: '@',
            time: '@'
        },
        transclude: true,
        templateUrl: 'sensors-app/circle-sensor/circle-sensor.html',
        link: function ($scope, $element) {
            var d3svg = d3.selectAll($element).select('svg');
            d3svg.select('path.blue-circle').attr('d', ARC_FN({
                endAngle: Math.PI * 2,
                startAngle: 0
            }));

            var path = d3svg.select('path.grey-circle').datum({
                startAngle: 0,
                endAngle: DEFAULT_ARC_ANGLE
            }).attr('d', ARC_FN);

            var circle = d3svg.select('circle').attr('angle', -45);

            function startAnimation(angle) {
                var angleRadians = angle * Math.PI * 2 / 360;
                d3svg.transition().ease('linear').duration(1500).each(function () {
                    path.transition().call(arcTween, angleRadians);
                    circle.datum(angle).transition().attrTween('transform', rotateFn);
                });
            }

            $scope.$watch('angle', function (angle) {
                startAnimation(angle);
            });
        }
    };
});