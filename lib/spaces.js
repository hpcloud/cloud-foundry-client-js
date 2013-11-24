/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    'jquery',
    './collection',
    './page'],
    function ($, Collection, Page) {

        var spaces = function (api) {
            this.api = api;
            this.collection = 'spaces';
        };

        spaces.prototype = Object.create(new Collection());

        spaces.prototype.getSummary = function (guid, done) {

            this.api.get('/v2/spaces/' + guid + '/summary', {status_code: 200}, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
            });
        };

        spaces.prototype.getUsage = function (guid, done) {
            this.api.get('/v2/spaces/' + guid + '/usage', {status_code: 200}, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
            });
        };

        spaces.prototype.getUsers = function (guid, type, done) {

            var self = this;

            this.api.get('/v2/spaces/' + guid + '/' + type + '?inline-relations-depth=1', {status_code: 200}, function (err, users_res) {
                if (err) { return done(err);}

                done(null, new Page(self, users_res.body));
            });
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
