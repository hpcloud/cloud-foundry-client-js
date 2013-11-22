/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var routes = function (api) {
            this.api = api;
            this.collection = 'routes';
        };

        routes.prototype = Object.create(new Collection());

        return routes;
    }
);