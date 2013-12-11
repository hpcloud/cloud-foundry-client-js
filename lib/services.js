/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var services = function (api) {
            this.api = api;
            this.collection = 'services';
        };

        services.prototype = Object.create(new Collection());

        return services;
    }
);