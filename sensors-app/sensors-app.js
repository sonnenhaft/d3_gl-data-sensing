angular.module('sensors-app', [
    'circle-sensor'
]).run(function ($rootScope) {
    var sensors = [
        {time: '4:30AM', angle: 0, label: ''},
        {time: '7:30PM', angle: 45, label: 'Peak Usage'},
        {time: '7:30AM', angle: 90, label: 'Normal Usage'},
        {time: '2:30PM', angle: 135, label: 'Low Usage'},
        {time: '2:30PM', angle: 135, label: 'Low Usage'},
        {time: '2:30PM', angle: 135, label: 'Low Usage'}
    ];

    $rootScope.sensors = sensors;
    $rootScope.randomize = function () {
        sensors.forEach(function (item) {
            item.angle = Math.round(Math.random() * 8) * 45;
        });
    };
});