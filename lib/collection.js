/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    'underscore',
    './page'],
    function (_, Page) {

        var api_version_prefix = '/v2/';

        var collection = function () {

        };

        collection.prototype = {

            makeQueryString: function (options) {

                options = options || {};

                var query = '',
                    first_q = true;

                if (options.queries) {
                    _.each(options.queries, function (value, key) {
                        query = query + ((first_q ? '?' : '&') + key + '=' + value);
                        first_q = false;
                    });
                }

                if (options.filter && options.filter.name) {
                    query = query + ((first_q ? '?' : '&') + 'q=' + options.filter.name + ':' + options.filter.value);
                }

                return query;
            },

            getCollectionUrl: function () {
                return api_version_prefix + this.collection;
            },

            get: function (guid, options, done) {

                options = options || {};
                options.query = this.makeQueryString(options);
                options.status_code = 200;

                var path = api_version_prefix + this.collection + '/' + guid;

                this.api.get(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            getSummary: function (guid, options, done) {

                options = options || {};
                options.query = this.makeQueryString(options);
                options.status_code = 200;

                var path = api_version_prefix + this.collection + '/' + guid + '/summary';

                this.api.get(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            delete_: function (guid, options, done) {

                options = options || {};
                options.query = this.makeQueryString(options);
                options.status_codes = [204, 201];

                var path = api_version_prefix + this.collection + '/' + guid;

                this.api.delete_(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null);
                });
            },

            create: function (data, options, done) {

                options = options || {};
                options.data = data;
                options.query = this.makeQueryString(options);
                options.status_codes = [200, 201];

                var path = api_version_prefix + this.collection;

                this.api.post(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            update: function (guid, data, options, done) {

                options = options || {};
                options.data = data;
                options.query = this.makeQueryString(options);
                options.status_code = 201;

                var path = api_version_prefix + this.collection + '/' + guid;

                this.api.put(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            list: function (options, done) {

                options = options || {};
                options.query = this.makeQueryString(options);
                options.status_code = 200;

                var self = this,
                    path = api_version_prefix + this.collection;

                this.api.get(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, new Page(self, res.body));
                });
            }
        };

        return collection;
    }
);
