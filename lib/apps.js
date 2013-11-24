/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var apps = function (api) {
            this.api = api;
            this.collection = 'apps';
        };

        apps.prototype = Object.create(new Collection());

        apps.prototype.getAppInstances = function (guid, done) {

            this.api.get('/v2/apps/' + guid + '/instances', {status_code: 200}, function (err, res) {
                if (err) {
                    return done(err, res);
                }
                done(null, res.body);
            });
        };

        apps.prototype.getUsage = function (guid, done) {
            this.api.get('/v2/apps/' + guid + '/usage', {status_code: 200}, function (err, res) {
                if (err) {
                    return done(err);
                }
                done(null, res.body);
            });
        };

        apps.prototype.getFiles = function (guid, instance_index, path, done) {
            this.api.get(this.getCollectionUrl() + '/' + guid + '/instances/' + instance_index + '/files/' + path, {query: '?allow_redirect=false', status_code: 200}, done);
        };

        // TODO: Pull out in to Stackato specific extension
        apps.prototype.getLogTail = function (guid, line_count, done) {
            this.api.get(this.getCollectionUrl() + '/' + guid + '/stackato_logs', {query: '?num=' + (line_count || 25) + '&monolith=1', status_code: 200}, done)
        };

        apps.prototype.routes = function (guid) {

            var app_routes_collection = new Collection();

            app_routes_collection.api = this.api;
            app_routes_collection.collection = this.collection + '/' + guid + '/routes';

            return app_routes_collection;
        };

        return apps;
    }
);
