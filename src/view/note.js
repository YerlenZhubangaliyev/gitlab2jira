define([
    './base',
    '../util',
    'collection/note'
], function (Base, Util, NoteCollection) {
    'use strict';

    return Base.extend({
        options: {
            counter: 0,
            comments_counter: 0,
            issue: 0,
            data: []
        },
        onInitialize: function () {
            var self = this;

            self.on('stopLoop', function () {
                self.collection.off('sync');
            });

            self.on('startLoop', function () {
                self.options.counter += 1;
                var
                    params = Util.deepExtend(self.options.collectionParams, {
                    issue: self.options.sysIds[self.options.counter]
                });

                self.collection = new NoteCollection([], params);
                self.collection.on('sync', self.render, self);
                self.collection.fetch(params);

                if (!_.isUndefined(self.options.sysIds[self.options.counter])) {
                    Util.addTextToProgressBar("Fetch comments from issue #" + self.options.sysIds[self.options.counter]);
                }
            });
        },
        render: function () {
            var self = this,
                data = self.collection.toJSON(),
                issueKey = (!_.isUndefined(self.options.sysIds[self.options.counter])) ? self.options.sysIds[self.options.counter] : false;

            if (self.options.counter <= self.options.sysIds.length) {
                if (issueKey !== false) {
                    self.options.data.push(data);
                    self.options.comments_counter += data.length;
                }

                self.trigger('startLoop');
            } else {
                self.trigger('stopLoop');
            }
        }
    });
});