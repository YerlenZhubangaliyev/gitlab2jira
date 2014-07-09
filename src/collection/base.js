/**
 * Базовая коллекция
 */
define(['backbone'], function (Backbone) {
    'use strict';

    return Backbone.Collection.extend({
        initialize: function (models, options) {
            if (!_.isUndefined(options)) {
                if (_.has(options, 'id')) {
                    this.id = options.id;
                }

                if (_.has(options, 'project')) {
                    this.project = options.project;
                }

                if (_.has(options, 'issue')) {
                    this.issue = options.issue;
                }

                if (_.has(options, 'query')) {
                    this.query = "?" + $.param(options.query);
                }
            }
        }
    });
});
