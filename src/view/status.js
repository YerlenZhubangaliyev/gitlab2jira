define(['./base', 'mediator'], function (Base, ignore) {
    'use strict';

    return Base.extend({
        el: '.status',
        subscriptions: {
            'status:show': 'render'
        },
        render: function (message) {
            var self = this;

            self.$el.stop().show('fast', function () {
                self.$el.html(message);


            });
        }
    });
});
