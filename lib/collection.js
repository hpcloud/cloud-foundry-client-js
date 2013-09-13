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

            get: function (guid, done) {

                var path = api_version_prefix + this.collection + '/' + guid;

                this.api.get(path, {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            delete_: function (guid, options, done) {

                var path = api_version_prefix + this.collection + '/' + guid;

                this.api.delete_(path, {status_code: 204}, function (err, res) {
                    if (err) {return done(err);}
                    done(null);
                });
            },

            create: function (data, options, done) {

                var path = api_version_prefix + this.collection;

                this.api.post(path, {data: data, status_code: 201}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.headers['Location']);
                });
            },

            update: function (guid, data, options, done) {

                var path = api_version_prefix + this.collection + '/' + guid;

                this.api.put(path, {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            },

            list: function (options, done) {

                options = options || {};

                var path = api_version_prefix + this.collection,
                    query = '?',
                    first_q = true;

                if (options.paging) {
                    _.each(options.paging, function (value, key) {
                        query = query + ((first_q ? '' : '&') + key + '=' + value);
                        first_q = false;
                    });
                }

                if (options.inline_relationships_depth) {
                    query = query + (first_q ? '' : '&') + 'inline-relations-depth=' + options.inline_relationships_depth;
                    first_q = false;
                }

                if (options.filter && options.filter.name && options.filter.value) {
                    query = query + ((first_q ? '' : '&') + 'q=' + options.filter.name + ':' + options.filter.value);
                }

                var self = this;
                this.api.get(path, {query: query, status_code: 200}, function (err, res) {
                    if (err) {return done(err);}

                    done(null, new Page(self, res.body));
                });
            }
        };

        return collection;
    }
);