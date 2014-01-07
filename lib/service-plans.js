/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './collection'],
    function (Collection) {

        var service_plans = function (api) {
            this.api = api;
            this.collection = 'service_plans';
        };

        service_plans.prototype = Object.create(new Collection());

        return service_plans;
    }
);
