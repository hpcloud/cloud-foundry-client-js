/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    'underscore',
    './collection'],
    function (_, Collection) {

        var users = function (api) {
            this.api = api;
            this.collection = 'users';
        };

        users.prototype = Object.create(new Collection());

        /**
         *
         * @param {Function} done Called on success and error.
         */
        users.prototype.getAuthorizationEndpoint = function (done) {

            var self = this;
            if (this.api.authorization_endpoint) {
                setTimeout(function () {
                    done(self.api.authorization_endpoint)
                }, 1);
            } else {
                this.api.get('/info', {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    self.api.authorization_endpoint = res.body.authorization_endpoint;
                    done(self.api.authorization_endpoint);
                });
            }
        };

        /**
         * Gets info about the current user (based on the configured token) from the UAA server.
         * @param {Function} done Called on success and error.
         */
        users.prototype.getCurrentUserInfo = function (done) {

            var self = this;
            this.getAuthorizationEndpoint(function (authorization_endpoint) {

                var user_info_url = authorization_endpoint + '/userinfo';

                self.api.get(user_info_url, {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            });
        };

        /**
         * Exchanges an array of user guids for the specified attributes with the UAA.
         * @param {Array} guids An array containing user guids to exchange.
         * @param {String} attributes A comma separated list of UAA user attributes.
         * @param {Function} done Called on success and error.
         */
        users.prototype.guidExchange = function (guids, attributes, done) {

            var self = this;
            this.getAuthorizationEndpoint(function (authorization_endpoint) {

                var users_url = res.body.authorization_endpoint + '/Users?attributes=' + attributes + '&filters=';

                _.each(guids, function (guid, i) {
                    users_url = users_url + ((i === 0 || i === guids.length - 1) ? '' : ' or ') + 'id eq ' + guid;
                });

                self.api.get(users_url, {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            });
        };

        return users;
    }
);