/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './collection'],
    function (Collection) {

        var api_version_prefix = "/v2/"

        var spaces = function (api) {
            this.api = api;
            this.collection = 'spaces';
        };

        spaces.prototype = Object.create(new Collection());

        spaces.prototype.getUsage = function (guid, options, done) {

            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.status_code = 200;

            this.api.get('/v2/spaces/' + guid + '/usage', options, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
            });
        };

        spaces.prototype.developers = function (guid) {

            var space_developers_collection = new Collection();

            space_developers_collection.api = this.api;
            space_developers_collection.collection = this.collection + '/' + guid + '/developers';

            return space_developers_collection;
        };

        spaces.prototype.auditors = function (guid) {

            var space_auditors_collection = new Collection();

            space_auditors_collection.api = this.api;
            space_auditors_collection.collection = this.collection + '/' + guid + '/auditors';

            return space_auditors_collection;
        };

        spaces.prototype.managers = function (guid) {

            var space_managers_collection = new Collection();

            space_managers_collection.api = this.api;
            space_managers_collection.collection = this.collection + '/' + guid + '/managers';

            return space_managers_collection;
        };

        spaces.prototype.domains = function (guid) {

            var space_domains_collection = new Collection();

            space_domains_collection.api = this.api;
            space_domains_collection.collection = this.collection + '/' + guid + '/domains';

            return space_domains_collection;
        };

        spaces.prototype.addAuditor = function (org_guid, user_guid, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_codes = [204, 201];

            var path = api_version_prefix + this.collection + '/' + org_guid + "/auditors/" + user_guid;
            this.api.put(path, options, function (err, res) {
                if (err) {return done(err);}
                done(null);
            });
        };

        spaces.prototype.addDeveloper = function (org_guid, user_guid, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_codes = [204, 201];

            var path = api_version_prefix + this.collection + '/' + org_guid + "/developers/" + user_guid;
            this.api.put(path, options, function (err, res) {
                if (err) {return done(err);}
                done(null);
            });
        };

        spaces.prototype.addManager = function (org_guid, user_guid, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_codes = [204, 201];

            var path = api_version_prefix + this.collection + '/' + org_guid + "/managers/" + user_guid;
            this.api.put(path, options, function (err, res) {
                if (err) {return done(err);}
                done(null);
            });
        };

        spaces.prototype.removeAuditor = function (org_guid, user_guid, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_codes = [204, 201];

            var path = api_version_prefix + this.collection + '/' + org_guid + "/auditors/" + user_guid;
            this.api.delete_(path, options, function (err) {
                if (err) {return done(err);}
                done(null);
            });
        };

        spaces.prototype.removeDeveloper = function (org_guid, user_guid, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_codes = [204, 201];

            var path = api_version_prefix + this.collection + '/' + org_guid + "/developers/" + user_guid;
            this.api.delete_(path, options, function (err) {
                if (err) {return done(err);}
                done(null);
            });
        };

        spaces.prototype.removeManager = function (org_guid, user_guid, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_codes = [204, 201];

            var path = api_version_prefix + this.collection + '/' + org_guid + "/managers/" + user_guid;
            this.api.delete_(path, options, function (err) {
                if (err) {return done(err);}
                done(null);
            });
        };

        return spaces;
    }
);
