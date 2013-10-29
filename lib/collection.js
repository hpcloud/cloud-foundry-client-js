/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

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

                if (options.filter && options.filter.name && options.filter.value) {
                    query = query + ((first_q ? '?' : '&') + 'q=' + options.filter.name + ':' + options.filter.value);
                }

                return query;
            },

            getCollectionUrl: function (){
                return api_version_prefix + this.collection;
            },

            get: function (guid, options, done) {

                var path = api_version_prefix + this.collection + '/' + guid,
                    query = this.makeQueryString(options);

                this.api.get(path, {query: query, status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            getSummary: function (guid, options, done) {

                var path = api_version_prefix + this.collection + '/' + guid + '/summary',
                    query = this.makeQueryString(options);

                this.api.get(path, {query: query, status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            delete_: function (guid, options, done) {

                var path = api_version_prefix + this.collection + '/' + guid,
                    query = this.makeQueryString(options);

                this.api.delete_(path, {query: query, status_code: 204}, function (err, res) {
                    if (err) {return done(err);}
                    done(null);
                });
            },

            create: function (data, options, done) {

                var path = api_version_prefix + this.collection,
                    query = this.makeQueryString(options);

                this.api.post(path, {query: query, data: data, status_code: 201}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            update: function (guid, data, options, done) {

                var path = api_version_prefix + this.collection + '/' + guid,
                    query = this.makeQueryString(options);

                this.api.put(path, {query: query, data: data, status_code: 201}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            list: function (options, done) {

                var self = this,
                    path = api_version_prefix + this.collection,
                    query = this.makeQueryString(options);

                this.api.get(path, {query: query, status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, new Page(self, res.body));
                });
            }
        };

        return collection;
    }
);
