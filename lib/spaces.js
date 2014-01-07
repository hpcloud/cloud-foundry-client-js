/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './collection'],
    function (Collection) {

        var spaces = function (api) {
            this.api = api;
            this.collection = 'spaces';
        };

        spaces.prototype = Object.create(new Collection());

        spaces.prototype.getUsage = function (guid, done) {
            this.api.get('/v2/spaces/' + guid + '/usage', {status_code: 200}, function (err, res) {
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

        return spaces;
    }
);
