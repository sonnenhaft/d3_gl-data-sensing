angular.module('graph.single-bar', [
    'graph.d3-wrapper'
]).directive('singleBar', function (d3WrapperService) {
    var MAX_VALUE = 5000;
    return {
        scope: {value: '=?'},
        templateUrl: 'src/graph/single-bar/single-bar.html',
        link: function ($scope, $element) {
            var $ = d3WrapperService.wrap($element);
            $scope.$watch('value', function (value) {
                $.linearTransition(2000, function () {
                    var v = (1 - value / MAX_VALUE) * 90;
                    $('g').transition().attr('transform', 'translate(0,' + v + ')');
                    $('text').transition().tween('text', function () {
                        var i = d3.interpolateRound(this.textContent, value);
                        return function (t) {
                            this.textContent = i(t);
                        };
                    });
                });
            })
        }
    };
});