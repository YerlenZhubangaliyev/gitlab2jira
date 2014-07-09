define([
    './base',
    '../app',
    '../util',
    './status',
    './issue',
    './note',
    'collection/issue',
    'collection/note',
    'model/root',
    'model/project',
    'model/issue',
    'model/note',
    'model/history',
    'lib/jquery-parseParams',
    'backbone'
], function (Base,
             App,
             Util,
             StatusView,
             IssueView,
             NoteView,
             IssueCollection,
             NoteCollection,
             RootModel,
             ProjectModel,
             IssueModel,
             NoteModel,
             HistoryModel) {
    'use strict';

    return Base.extend({
        el: "body",
        elements: {
            form: "#request_form"
        },
        subscriptions: {

        },
        onInitialize: function () {
            var
                self = this;

            self.$el.html(App.Template.main);
            (new StatusView());
            self.render();
        },
        render: function () {
            var
                self = this,
                _export = new RootModel();

            $(self.elements.form).on('submit', function () {
                var
                    $_this           = $(this),
                    formParams       = $_this.serializeArray(),
                    keys             = _.pluck(formParams, 'name'),
                    values           = _.pluck(formParams, 'value'),
                    object           = _.object(keys, values),
                    formObject       = $.parseParams("?" + $_this.serialize()),
                    collectionParams = {
                        project: encodeURIComponent(object.gl_pid),
                        query: {
                            private_token: object.gl_pt,
                            page: 1,
                            per_page: 100
                        }
                    },
                    issueView        = new IssueView({
                        options: {
                            key: object.jr_key,
                            collectionParams: collectionParams,
                        },
                        collection: new IssueCollection([], collectionParams)
                    });

                $_this.find('textarea').val("");
                issueView.on('stopLoop', function () {
                    var
                        issueSysId       = self.getIssuesIds(issueView.options.data, 'id'),
                        issueProjId      = self.getIssuesIds(issueView.options.data, 'iid'),
                        collectionParams = {
                            project: encodeURIComponent(object.gl_pid),
                            issue: issueSysId[0],
                            query: {
                                private_token: object.gl_pt
                            }
                        },
                        noteView         = new NoteView({
                            options: {
                                sysIds: issueSysId,
                                projIds: issueProjId,
                                collectionParams: collectionParams
                            },
                            collection: new NoteCollection([], collectionParams)
                        });

                    Util.showStatus(issueView.options.data.length + " issues found at " + object.gl_pid);

                    noteView.on('stopLoop', function () {
                        //console.log(noteView.options.data);
                        Util.showStatus(noteView.options.comments_counter + " comments fetched from " + issueView.options.data.length + " issues, at " + object.gl_pid);

                        //console.log(issueView.options.data[0]);
                        //console.log(noteView.options.data);

                        var
                            Root    = new RootModel(),
                            Project = new ProjectModel({
                                name: formObject.jr_name,
                                key: formObject.jr_key
                            }),
                            IssuesArrayOfObjects = [];

                        _.each(issueView.options.data, function (value, key) {
                            var
                                assignee = (_.has(value, 'assignee') && !_.isNull(value.assignee)) ? value.assignee.username : "",
                                watchers = [
                                    value.author.username
                                ],
                                Issue = new IssueModel({
                                    externalId: value.iid,
                                    summary: value.title,
                                    description: value.description,
                                    created: value.created_at,
                                    updated: value.updated_at,
                                    assignee: assignee,
                                    reporter: value.author.username,
                                    key: formObject.jr_key + "-" + value.iid
                                }),
                                priority = self.findPriority(value.labels),
                                type = self.findType(formObject.label.type, value.labels),
                                comments = [],
                                commentsObject = [],
                                History = new HistoryModel({
                                    author: value.author.username,
                                    created: value.created_at
                                });

                            // Set <WATCHERS>
                            if (!_.isEmpty(assignee)) {
                                watchers.push(assignee);
                                watchers = _.uniq(watchers);
                            }

                            Issue.set('watchers', watchers);

                            // Set <STATUS>
                            Issue.set('status', formObject.issue.status[value.state]);

                            // Set <RESOLUTION>
                            if (value.state == 'closed') {
                                Issue.set('resolution', "Resolved");
                            }

                            // Set <TYPE>
                            if (!_.isEmpty(type)) {
                                Issue.set('issueType', type);
                            }

                            // Set <PRIORITY>
                            if (!_.isEmpty(priority) && _.has(formObject.label.priority, priority))
                            {
                                Issue.set('priority', formObject.label.priority[priority]);
                            }

                            // Set <HISTORY> -> <AUTHOR>
                            Issue.set('history', [History]);

                            // Set <COMMENTS>
                            comments = noteView.options.data[_.indexOf(issueSysId, value.id)];
                            if (!_.isEmpty(comments)) {
                                var commentsObject = [];

                                _.each(comments, function (cVal, cKey) {
                                    var Note = new NoteModel({
                                        body: cVal.body,
                                        author: cVal.author.username,
                                        created: cVal.created_at
                                    });

                                    commentsObject.push(Note.toJSON());
                                });

                                Issue.set('comments', commentsObject);
                            }

                            IssuesArrayOfObjects.push(Issue.toJSON());
                        });

                        Project.set('issues', IssuesArrayOfObjects);
                        Root.set("projects", [Project.toJSON()]);

                        $("#json_result").val(JSON.stringify(Root));
                    });
                });

                return false;
            });
        },
        /**
         * Parse issues
         * @param data
         */
        findPriority: function (labelsArray) {
            var
                regexp = /\(Priority\) \- ([a-zA-Z+])/g,
                result = "";

            _.each(labelsArray, function (val, key) {
                if (regexp.test(val)) {
                    result = val;
                }
            });

            return result;
        },
        /**
         *
         * @param mapTypes
         * @param labels
         * @returns {boolean}
         */
        findType: function (mapTypes, labels) {
            var
                keys = _.keys(mapTypes),
                result = '';

            if (!_.isEmpty(labels)) {
                _.each(labels, function (val) {
                    var index = _.indexOf(keys, val);
                    if (index > -1) {
                        result = mapTypes[keys[index]];
                    }
                });
            }

            return result;
        },
        /**
         *
         * @param list
         * @param needleKey
         * @returns {Array}
         */
        getIssuesIds: function (list, needleKey) {
            return _.map(list, function (value, key) {
                return value[needleKey];
            });
        }
    });
});
