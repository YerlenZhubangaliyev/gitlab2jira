requirejs.config({
    urlArgs: "refresh=" + (new Date()).getTime(),
    waitSeconds: 20,
    baseUrl: './',
    paths: {
        require:       '../bower_components/requirejs/require',
        text:          '../bower_components/requirejs-text/text',
        css:           '../bower_components/require-css/css',
        'css-builder': '../bower_components/require-css/css-builder',
        normalize:     '../bower_components/require-css/normalize',
        backbone:      '../bower_components/backbone/backbone',
        underscore:    '../bower_components/underscore/underscore',
        jquery:        '../bower_components/jquery/dist/jquery',
        bootstrap:     '../bower_components/bootstrap/dist/js/bootstrap',
        bootstrap_css: '../bower_components/bootstrap/dist/css/bootstrap',
        mediator:      '../bower_components/backbone-mediator/backbone-mediator',
        pace:          '../bower_components/pace/pace',
        pace_css:      '../bower_components/pace/themes/pace-theme-center-simple'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps:    [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'jquery': {
            exports: [
                '$',
                'jQuery'
            ]
        },
        'bootstrap': {
            deps: [
                'jquery'
            ]
        },
        mediator: {
            deps: [
                'backbone'
            ]
        }
    },
    config: {
        'app': {
            base: {
                url: 'http://gitlab.local',
                path: '/api/v3/'
            }
        }
    }
});
