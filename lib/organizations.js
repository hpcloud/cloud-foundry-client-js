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

        organizations.prototype.getUsers = function (guid, done) {

            var self = this;

            this.api.get('/v2/organizations/' + guid + '/users?inline-relations-depth=1', {status_code: 200}, function (err, users_res) {
                if (err) {return done(err);}

                done(null, new Page(self, users_res.body));
            });
        };

        return organizations;
    }
);
