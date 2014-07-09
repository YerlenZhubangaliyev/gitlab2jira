/**
 *
 */
define(['module', './template'], function (module, Template) {
    "use strict";

    var App             = module.exports;
    App.Root            = module.config().root;
    App.UrlRoot         = module.config().base.url;
    App.BasePath        = module.config().base.path;
    App.Template        = Template;
});
