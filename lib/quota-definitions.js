/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var apps = function (api) {
            this.api = api;
            this.collection = 'quota_definitions';
        };

        apps.prototype = Object.create(new Collection());

        return apps;
    }
);