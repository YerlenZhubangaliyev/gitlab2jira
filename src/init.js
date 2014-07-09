/**
 *
 */
require([
    'view/main',
    'util',
    'bootstrap',
    'css!pace_css',
    'css!bootstrap_css'
], function (Main, Util) {
    'use strict';

    Util.setCors();
    new Main();
});
