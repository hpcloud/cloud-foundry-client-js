/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var service_instances = function (api) {
            this.api = api;
            this.collection = 'service_instances';
        };

        service_instances.prototype = Object.create(new Collection());

        return service_instances;
    }
);
