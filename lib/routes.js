/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
        'underscore',
        './collection'],
    function (_, Collection) {

        var routes = function (api) {
            this.api = api;
            this.collection = 'routes';
        };

        routes.prototype = Object.create(new Collection());

        routes.prototype.apps = function (route_guid) {

            var route_apps_collection = new Collection();

            route_apps_collection.api = this.api;
            route_apps_collection.collection = this.collection + '/' + route_guid + '/apps';

            return route_apps_collection;
        };

        return routes;
    }
);