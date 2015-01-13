angular.module('sensors-app', [
    'graph.circle-sensor',
    'graph.area-chart',
    'graph.chart-background',
    'graph.volume-usage-graph',
    'graph.live-chart',
    'pages.route-config',
    'components.gl-header',
    'components.app-version',
    'components.dev-menu',
    /*==== login page ====*/
    'components.login-form',
    /*==== network-summary page ====*/
    'components.network-summary-block',
    'components.weather-data',
    'components.find-location'
]);