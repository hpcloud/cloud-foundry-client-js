/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var apps = function (api) {
            this.api = api;
            this.collection = 'apps';
        };

        apps.prototype = Object.create(new Collection());

        /**
         * Gets info about the current user (based on the configured token) from the UAA server.
         * @param {Function} done Called on success and error.
         */
        apps.prototype.getAppInstances = function (guid, done) {

            this.api.get('/v2/apps/' + guid + '/instances', {status_code: 200}, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
            });
        };

        return apps;
    }
);
