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
            this.paginated = true;
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

            get: function (resource_identifier, options, done) {

                if (typeof options === 'function' && typeof done === 'undefined') {
                    done = options;
                    options = null;
                }

                options = options || {};
                options.query = this.makeQueryString(options);
                options.status_code = 200;

                var path = api_version_prefix + this.collection + '/' + resource_identifier;

                this.api.get(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            getSummary: function (resource_identifier, options, done) {

                if (typeof options === 'function' && typeof done === 'undefined') {
                    done = options;
                    options = null;
                }

                options = options || {};
                options.query = this.makeQueryString(options);
                options.status_code = 200;

                var path = api_version_prefix + this.collection + '/' + resource_identifier + '/summary';

                this.api.get(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            delete_: function (resource_identifier, options, done) {

                if (typeof options === 'function' && typeof done === 'undefined') {
                    done = options;
                    options = null;
                }

                options = options || {};
                options.query = this.makeQueryString(options);
                options.status_codes = [204, 201];

                var path = api_version_prefix + this.collection + '/' + resource_identifier;

                this.api.delete_(path, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null);
                });
            },

            create: function (data, options, done) {

                if (typeof options === 'function' && typeof done === 'undefined') {
                    done = options;
                    options = null;
                }

                options = options || {};
                options.data = data;
                options.query = this.makeQueryString(options);
                options.status_codes = [200, 201];

                var path = api_version_prefix + this.collection;

                this.api.post(path, options, function (err, res) {
                    if (err) {return done(err, res);}
                    done(null, res.body);
                });
            },

            update: function (resource_identifier, data, options, done) {

                if (typeof options === 'function' && typeof done === 'undefined') {
                    done = options;
                    options = null;
                }

                options = options || {};
                options.data = data;
                options.query = this.makeQueryString(options);
                options.status_codes = [200, 201];

                var path = api_version_prefix + this.collection + '/' + resource_identifier;

                this.api.put(path, options, function (err, res) {
                    if (err) {return done(err, res);}
                    done(null, res.body);
                });
            },

            list: function (options, done) {

                if (typeof options === 'function' && typeof done === 'undefined') {
                    done = options;
                    options = null;
                }

                options = options || {};
                options.query = this.makeQueryString(options);
                options.status_code = 200;

                var self = this,
                    path = api_version_prefix + this.collection;

                this.api.get(path, options, function (err, res) {
                    if (err) {return done(err);}
                    var result = self.paginated ? new Page(self, res.body) : res.body;
                    done(null, result);
                });
            }
        };

        return collection;
    }
);
