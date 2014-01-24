/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

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
         * Gets info about the current user (based on the configured token) from the UAA server.
         */
        users.prototype.getCurrentUserInfo = function (options, done) {

            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.status_code = 200;

            var self = this;
            this.api.getAuthorizationEndpoint(function (err, authorization_endpoint) {
                if (err) {return done(err);}

                var user_info_url = authorization_endpoint + '/userinfo';

                self.api.get(user_info_url, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            });
        };

        /**
         * Updates a users attributes in the UAA.
         * @param {String} user_guid The guid of the user to update.
         * @param {Object} details Updated user attributes.
         * @param {Function} done Called on success and error.
         */
        users.prototype.updateDetails = function (user_guid, details, options, done) {

            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.status_code = 200;
            options.data = details;

            var self = this;
            this.api.getAuthorizationEndpoint(function (err, authorization_endpoint) {
                if (err) {return done(err);}

                var user_info_url = authorization_endpoint + '/Users/' + user_guid;

                self.api.put(user_info_url, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            });
        };

        /**
         * Changes a user's password.
         * @param {String} user_guid The guid of the user to change the password for.
         * @param {String} old_password The users old password, or null if the current user is an admin.
         * @param {String} new_password The new password to set.
         * @param {Function} done Called on success and error.
         */
        users.prototype.changePassword = function (user_guid, old_password, new_password, options, done) {

            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.status_code = 200;
            options.data = {oldPassword: old_password, password: new_password};
            options.ignore_unauthorized = true;

            var self = this;
            this.api.getAuthorizationEndpoint(function (err, authorization_endpoint) {
                if (err) {return done(err);}

                var password_url = authorization_endpoint + '/Users/' + user_guid + '/password';

                self.api.put(password_url, options, function (err, res) {
                    if (err) {return done(err, res.body);}
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
        users.prototype.guidExchange = function (guids, attributes, options, done) {

            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.status_code = 200;

            var self = this;
            this.api.getAuthorizationEndpoint(function (err, authorization_endpoint) {
                if (err) {return done(err);}

                var users_url = authorization_endpoint + '/Users?';

                if (attributes) {
                    users_url = users_url + 'attributes=' + attributes;
                }

                var filter_params = "";
                _.each(guids, function (guid, i) {
                    filter_params = filter_params + ((i === 0) ? '' : ' or ') + 'id eq "' + guid + '"';
                });

                if (filter_params) {
                    users_url = users_url + '&filter=' + filter_params;
                }

                self.api.get(users_url, options, function (err, res) {
                    if (err) {return done(err);}
                    done(null, res.body);
                });
            });
        };

        return users;
    }
);
