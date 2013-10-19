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
         * Gets the configured url to the authorization endpoint.
         * @param {Function} done Called on success and error.
         */
        users.prototype.getAuthorizationEndpoint = function (done) {

            var self = this;
            if (this.api.authorization_endpoint) {
                setTimeout(function () {
                    done(null, self.api.authorization_endpoint)
                }, 1);
            } else {
                this.api.get('/info', {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    self.api.authorization_endpoint = res.body.authorization_endpoint;
                    done(null, self.api.authorization_endpoint);
                });
            }
        };

        /**
         * Gets info about the current user (based on the configured token) from the UAA server.
         * @param {Function} done Called on success and error.
         */
        users.prototype.getCurrentUserInfo = function (done) {

            var self = this;
            this.getAuthorizationEndpoint(function (err, authorization_endpoint) {
                if (err) {return done(err);}

                var user_info_url = authorization_endpoint + '/userinfo';

                self.api.get(user_info_url, {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            });
        };

        /**
         * TODO: Pull this out in to an optional plugin
         * Creates a new user using a Stackato-specific api call to coordinate between the CC and UAA.
         * @param user_data
         * @param done
         */
        users.prototype.createNewUser = function (user_data, done) {
            var self = this;
            var create_user_url = '/v2/stackato/users';
            self.api.post(create_user_url, {data: user_data, status_code: 201}, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
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
            this.getAuthorizationEndpoint(function (err, authorization_endpoint) {
                if (err) {return done(err);}

                var users_url = authorization_endpoint + '/Users?attributes=' + attributes;

                //+ '&filter=';

                var filter_params = "";
                _.each(guids, function (guid, i) {
                    filter_params = filter_params + ((i === 0) ? '' : ' or ') + 'id eq "' + guid + '"';
                });

                if (filter_params) {
                    users_url = users_url + '&filter=' + filter_params;
                }

                self.api.get(users_url, {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            });
        };

        /**
         * Get list of existing user names
         */
        users.prototype.getUserNames = function (done) {
            var self = this;
            this.getAuthorizationEndpoint(function (err, authorization_endpoint) {
                if (err) {return done(err);}

                var users_url = authorization_endpoint + '/Users?attributes=userName';
                console.log(users_url);

                self.api.get(users_url, {status_code: 200}, function (err, res) {
                    if (err) {return done(err);}

                    var usernames = _.pluck(res.body.resources, 'userName');
                    done(null, usernames);
                });
            });
        };

        return users;
    }
);
