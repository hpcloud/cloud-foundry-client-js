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

        return feature_flags;
    }
);