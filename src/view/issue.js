define([
    './base',
    '../util',
    'collection/issue'
], function (Base, Util, IssueCollection) {
    'use strict';

    return Base.extend({
        options: {
            page:     1,
            per_page: 100,
            data:     []
        },
        onInitialize: function () {
            var self = this;

            self.on('stopLoop', function () {
                self.collection.off('sync');
            });

            self.on('startLoop', function () {
                var params = {};


                self.options.page += 1;
                params = Util.deepExtend(self.options.collectionParams, {
                    query: {
                        page: self.options.page
                    }
                });

                self.collection = new IssueCollection([], params);
                self.collection.on('sync', self.render, self);
                self.collection.fetch(params);

                Util.addTextToProgressBar("Fetching issues, page #" + self.options.page);
            });
        },
        render: function () {
            var self = this,
                data = self.collection.toJSON();

            if (data.length > 0) {
                self.options.data = _.union(self.options.data, data);
                self.trigger('startLoop');
            } else {
                self.trigger('stopLoop');
            }
        }
    });
});