/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([],
    function () {

        var page = function (collection, data) {
            this.collection = collection;
            this.data = data;
        };

        page.prototpe = {

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
                return this.data.prev_url;
            },

            getPrevPage: function (done) {
                this.getPage('prev', done);
            },

            hasNextPage: function () {
                return this.data.next_url;
            },

            getNextPage: function (done) {
                this.getPage('next', done);
            }
        };

        return page;
    }
);