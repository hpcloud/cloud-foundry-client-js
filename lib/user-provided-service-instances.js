/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './collection'],
    function (Collection) {

        var up_service_instances = function (api) {
            this.api = api;
            this.collection = 'user_provided_service_instances';
        };

        up_service_instances.prototype = Object.create(new Collection());

        return up_service_instances;
    }
);
