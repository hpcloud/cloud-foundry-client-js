/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var organizations = function (api) {
            this.api = api;
            this.collection = 'organizations';
        };

        organizations.prototype = Object.create(new Collection());

        return organizations;
    }
);