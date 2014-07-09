/**
 * Вспомогательные функции
 */
define([
    'app',
    'pace',
    'bootstrap',
    'mediator'
], function (App, Pace) {
    'use strict';

    var Util = function () {
        return {
            /**
             * "Глубокое расширение" :)
             *
             * @param   {Object} target
             * @returns {Object}
             */
            deepExtend: function (target) {
                var args = [true, target].concat(_.rest(arguments));

                return jQuery.extend.apply(jQuery, args);
            },
            /**
             *
             * @returns {boolean}
             */
            setCors: function () {
                if (!_.isUndefined($.ajaxPrefilter)) {
                    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                        options.url         = App.UrlRoot + App.BasePath + originalOptions.url;
                        options.crossDomain = true;
                    });

                    $(document)
                        .ajaxStart(function () {
                            Pace.start({
                                document: true
                            });
                        })
                        .ajaxSend(function() {
                            Pace.restart();
                        })
                        .ajaxStop(function () {
                            Pace.stop();
                        })
                        .ajaxError(function () {
                            Pace.stop();
                        });

                    return true;
                }
            },
            /**
             *
             * @param text
             */
            addTextToProgressBar: function (text) {
                $('.pace').append('<div class="text"/>').css({
                    'font-size': '.8em',
                    'padding-top': '4px',
                    'width': '200px'
                });
                $('.pace > .text').html(text.replace(" ", "&nbsp;"));
            },
            /**
             *
             */
            showStatus: function (message) {
                Backbone.Mediator.pub('status:show', message);
            }
        };
    };

    return new Util();
});
