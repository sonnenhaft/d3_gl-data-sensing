angular.module('3rd-party-libs', []).factory('d3', function ($window) {
    var d3 = $window.d3;
    d3.selection.prototype.drtEnter = function (data, tag, defaultAttrs) {
        var lines = this.selectAll(tag).data(data);
        lines.enter().append(tag).attr(defaultAttrs);
        lines.exit().remove();
        return lines;
    };

    d3.selection.prototype.linearTransition = function (time, callback) {
        var transition = this.transition();
        return transition.ease('linear').duration(time).each(function () {
            callback(transition);
        });
    };

    return d3;
});