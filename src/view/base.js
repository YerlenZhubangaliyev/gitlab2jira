/**
 * Базовый модуль View
 */
define([
    'util',
    'mediator'
], function (Util) {
    'use strict';

    return Backbone.View.extend({
        el: "",
        /**
         * Объект опций передаваемых представлению
         */
        options: {},
        events: {},
        /**
         * @see Backbone.Mediator
         */
        subscriptions: {},
        /**
         * @see Backbone.Collection
         */
        collection: {},
        /**
         * @see Backbone.Model
         */
        model: undefined,
        /**
         * Backbone.View.initialize|constructor
         * @param options
         */
        initialize: function () {
            var self = this;

            if (_.has(arguments, 0)) {
                self.options = Util.deepExtend({}, self.options, arguments[0].options);
            }

            if (_.isFunction(self.onInitialize)) {
                self.onInitialize();
            }

            if (!_.isUndefined(self.collection) && _.isFunction(self.collection.fetch)) {
                self.collection.fetch({cache: true});
                self.collection.on('sync', self.render, self);
            }

            self._eventAggregator = self.options && self.options.eventAggregator || self;
            self._parseTriggers();
        },
        /**
         *
         */
        onInitialize: function () {},
        /**
         * Парсинг самописных тригеров
         *
         * @private
         */
        _parseTriggers :  function () {
            _.each(this.triggers || {}, function (fn, event) {
                var handler = this[fn];

                if (_.isFunction(handler)) {
                    this.listenTo(this._eventAggregator, event, handler);
                }
            }, this);
        }
    });
});
