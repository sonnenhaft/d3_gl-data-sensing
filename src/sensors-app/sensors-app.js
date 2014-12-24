angular.module('sensors-app', [
    'circle-sensor', 'area-chart', 'chart-background', 'volume-usage-graph','live-chart'
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
        'JUN 5': 50,
        'JUN 10': 60,
        'JUN 15': 150,
        'JUN 20': 450,
        'JUN 21': 450,
        'JUN 22': 450,
        'JUN 23': 450,
        'JUN 24': 450,
        'JUN 26': 450,
        'JUN 27': 450,
        'JUN 25': 200,
        'JUN 30': 190,
        'JUN 31': 190,
        'JUN 32': 190,
        'JUN 33': 190,
        'JUN 34': 190,
        'JUN 3d4': 190,
        'JUN 3dv4': 190,
        'JUN 3dvs4': 190,
        'JUN 3dvss4': 190,
        'JUN 3dvssa4': 190,
        'JUN 3dvssas4': 190,
        'JUN 3dvssase4': 190,
        'JUN 3dvssasew4': 190,
        'JUN 3dvssasewq4': 190,
        'JUN 3dvssasewqq4': 190,
        'JUL 5': 100
    };

    $rootScope.valuesVolume = [100,99,98,97,96,95,94,93,92,91,90,85,80,75,70,65,60,55,50,45,40,35,30,25,20,15,10,5,3];

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
        });
    };
    $rootScope.changeValues = function(){
        $rootScope.valuesVolume = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    };
    $rootScope.randomizeArea();
});