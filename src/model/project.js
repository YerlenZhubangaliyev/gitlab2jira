define(['./base'], function (Base) {
    'use strict';

    return Base.extend({
        defaults: {
            "name":        "",
            "key":         "",
            "description": "",
            "issues":      []
        }
    });
});