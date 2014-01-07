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

            getPage: function (direction, done) {

                var url = direction === 'prev' ? this.data.prev_url : this.data.next_url;
                if (!url) {return done(new Error('Page unavailable.'));}

                var self = this;
                this.collection.api.get(url, {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, new page(self.collection, res.body));
                });
            },

            hasPrevPage: function () {
                return this.data.prev_url ? true : false;
            },

            getPrevPage: function (done) {
                this.getPage('prev', done);
            },

            hasNextPage: function () {
                return this.data.next_url ? true : false;
            },

            getNextPage: function (done) {
                this.getPage('next', done);
            }
        };

        return page;
    }
);