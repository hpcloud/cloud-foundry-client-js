/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './collection'],
    function (Collection) {

        var domains = function (api) {
            this.api = api;
            this.collection = 'domains';
        };

        domains.prototype = Object.create(new Collection());

        return domains;
    }
);
