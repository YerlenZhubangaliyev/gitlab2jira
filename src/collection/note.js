/**
 *
 */
define(['./base'], function (Base) {
    'use strict';

    return Base.extend({
        url: function () {
            return 'projects/' + this.project + "/issues/" + this.issue + "/notes" + this.query;
        }
    });
});
