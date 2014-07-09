define(['./base'], function (Base) {
    'use strict';

    return Base.extend({
        defaults: {
            "externalId":  0,
            "key":         "",
            "priority":    "Major",
            "description": "",
            "status":      "",
            "reporter":    "",
            "labels":      [],
            "watchers":    [],
            "issueType":   "Bug",
            "resolution":  "Unresolved",
            "created":     "",
            "updated":     "",
            "summary":     "",
            "assignee":    "",
            "comments":    [],
            "history":     []
        }
    });
});