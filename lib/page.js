/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([],
    function () {

        var page = function (collection, data) {
            this.collection = collection;
            this.data = data;
        };

        page.prototype = {

            getPage: function (direction, options, done) {

                var url = direction === 'prev' ? this.data.prev_url : this.data.next_url;
                if (!url) {return done(new Error('Page unavailable.'));}

                if (typeof options === 'function' && typeof done === 'undefined') {
                    done = options;
                    options = null;
                }

                options = options || {};
                options.status_code = 200;

                // Ensure that the query string is split out from the url and placed on options.query
                // xxx: This will override any user provided options.query value if the url does contain the query string.
                var queryPosition = url.indexOf('?');
                if (queryPosition > -1) {
                    options.query = url.substring(queryPosition);
                    url = url.substring(0, queryPosition);
                }

                var self = this;
                this.collection.api.get(url, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, new page(self.collection, res.body));
                });
            },

            hasPrevPage: function () {
                return this.data.prev_url ? true : false;
            },

            getPrevPage: function (options, done) {
                this.getPage('prev', options, done);
            },

            hasNextPage: function () {
                return this.data.next_url ? true : false;
            },

            getNextPage: function (options, done) {
                this.getPage('next', options, done);
            }
        };

        return page;
    }
);