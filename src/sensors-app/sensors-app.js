angular.module('sensors-app', [
    'circle-sensor', 'area-chart', 'chart-background', 'volume-usage-graph'
]).run(function ($rootScope) {
    var sensors = [
        {time: '4:30AM', angle: 0, label: ''},
        {time: '7:30PM', angle: 45, label: 'Peak Usage'},
        {time: '7:30AM', angle: 90, label: 'Normal Usage'},
        {time: '2:30PM', angle: 135, label: 'Low Usage'},
        {time: '2:30PM', angle: 135, label: 'Low Usage'},
        {time: '2:30PM', angle: 135, label: 'Low Usage'}
    ];

    var areaChart = {
        //'JUN 5': 50,
        //'JUN 10': 60,
        //'JUN 15': 150,
        //'JUN 20': 450,
        //'JUN 21': 450,
        //'JUN 22': 450,
        //'JUN 23': 450,
        //'JUN 24': 450,
        'JUN 26': 450,
        'JUN 27': 450,
        'JUN 25': 200,
        'JUN 30': 190,
        'JUN 31': 190,
        'JUN 32': 190,
        'JUN 33': 190,
        'JUN 34': 190,
        'JUL 5': 100
    };

    $rootScope.sensors = sensors;
    $rootScope.areaChart = areaChart;
    $rootScope.randomize = function () {
        sensors.forEach(function (item) {
            item.angle = Math.round(Math.random() * 8) * 45;
        });
    };
    $rootScope.randomizeArea = function () {
        angular.forEach(areaChart, function (item, key) {
            areaChart[key] = Math.round(Math.random() * 10) * 40;
        })
    };
    $rootScope.randomizeArea();
});