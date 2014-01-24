/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './collection'],
    function (Collection) {

        var apps = function (api) {
            this.api = api;
            this.collection = 'apps';
        };

        apps.prototype = Object.create(new Collection());

        apps.prototype.getInstances = function (guid, options, done) {

            options = options || {};
            options.status_code = 200;

            this.api.get('/v2/apps/' + guid + '/instances', options, function (err, res) {
                if (err) {return done(err, res);}
                done(null, res.body);
            });
        };

        apps.prototype.getUsage = function (guid, options, done) {

            options = options || {};
            options.status_code = 200;

            this.api.get('/v2/apps/' + guid + '/usage', options, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
            });
        };

        apps.prototype.getFiles = function (guid, instance_index, file_path, options, done) {

            options = options || {};
            options.status_code = 200;
            options.query = '?allow_redirect=false';

            var path = this.getCollectionUrl() + '/' + guid + '/instances/' + instance_index + '/files/' + file_path;

            this.api.get(path, options, done);
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
