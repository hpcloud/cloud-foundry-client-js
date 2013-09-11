/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    'cloud-foundry-client/lib/collection'],
    function (Collection) {

        var apps = function (api) {
            this.api = api;
            this.collection = 'apps';
        };

        apps.prototype = Object.create(new Collection());

        return apps;
    }
);