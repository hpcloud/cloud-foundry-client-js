/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var service_bindings = function (api) {
            this.api = api;
            this.collection = 'service_bindings';
        };

        service_bindings.prototype = Object.create(new Collection());

        return service_bindings;
    }
);
