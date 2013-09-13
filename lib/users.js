/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var users = function (api) {
            this.api = api;
            this.collection = 'users';
        };

        users.prototype = Object.create(new Collection());

        users.prototype.getCurrentUserInfo = function (done) {

            var self = this;
            this.api.get('/info', {}, function (err, res) {
                if (err) {return done(err);}

                var user_info_url = res.body.authorization_endpoint + '/userinfo';

                self.api.get(user_info_url, {}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            });
        };

        return users;
    }
);