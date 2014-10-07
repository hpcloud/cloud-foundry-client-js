/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './collection'],
    function (Collection) {

        var api_version_prefix = "/v2/";

        var space_quota_definitions = function (api) {
            this.api = api;
            this.collection = 'space_quota_definitions';
        };

        space_quota_definitions.prototype = Object.create(new Collection());

        space_quota_definitions.prototype.removeSpace = function (space_quota_guid, space_guid, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_codes = [204, 201];

            var path = api_version_prefix + this.collection + '/' + space_quota_guid + "/spaces/" + space_guid;
            this.api.delete_(path, options, function (err) {
                if (err) {return done(err);}
                done(null);
            });
        };

        return space_quota_definitions;
    }
);
