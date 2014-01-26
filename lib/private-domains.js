/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './collection'],
    function (Collection) {

        var domains = function (api) {
            this.api = api;
            this.collection = 'private_domains';
        };

        domains.prototype = Object.create(new Collection());

        return domains;
    }
);
