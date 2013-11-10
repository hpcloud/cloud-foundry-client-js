/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection',
    './page'],
    function (Collection, Page) {

        var organizations = function (api) {
            this.api = api;
            this.collection = 'organizations';
        };

        organizations.prototype = Object.create(new Collection());

        organizations.prototype.getUsers = function (guid, options, done) {

            var path = this.getCollectionUrl() + '/' + guid + '/users',
                query = this.makeQueryString(options);

            this.api.get(path, {query: query, status_code: 200}, function (err, res) {
                if (err) {return done(err);}
                done(null, new Page(self, res.body));
            });
        };

        return organizations;
    }
);
