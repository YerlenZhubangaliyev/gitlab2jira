define(['./base'], function (Base) {
    'use strict';

    return Base.extend({
        defaults: {
            "author":  "",
            "created": "",
            "items":   []
        }
    });
});