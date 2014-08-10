/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
        'underscore',
        './collection'],
    function (_, Collection) {

        var app_usage_events = function (api) {
            this.api = api;
            this.collection = 'app_usage_events';
        };

        app_usage_events.prototype = Object.create(new Collection());
        app_usage_events.prototype.getSummary = null;
        app_usage_events.prototype.delete_ = null;
        app_usage_events.prototype.create = null;
        app_usage_events.prototype.update = null;

        app_usage_events.prototype.purge_and_reseed = function (data, options, done) {

            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.data = data;
            options.query = this.makeQueryString(options);
            options.status_codes = [204];

            var path = this.getCollectionUrl() + '/destructively_purge_all_and_reseed_started_apps';

            this.api.post(path, options, function (err, res) {
                if (err) {return done(err, res);}
                done(null, res.body);
            });
        };

        return app_usage_events;
    }
);