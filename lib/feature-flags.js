/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
        'underscore',
        './collection'],
    function (_, Collection) {

        var feature_flags = function (api) {
            this.api = api;
            this.collection = 'config/feature_flags';
            this.paginated = false;
        };

        feature_flags.prototype = Object.create(new Collection());
        feature_flags.prototype.getSummary = null;
        feature_flags.prototype.delete_ = null;
        feature_flags.prototype.create = null;

        feature_flags.prototype.setFlag = function (flagName, config, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.status_codes = [200, 204];
            options.data = config;

            var feature_flag_url = this.collection + '/' + encodeURIComponent(flagName);

            this.api.put(feature_flag_url, options, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
            });
        };

        return feature_flags;
    }
);