/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    'jquery',
    'cloud-foundry-client/lib/collection'],
    function ($, Collection) {

        var spaces = function (api) {
            this.api = api;
            this.collection = 'spaces';
        };

        spaces.prototype = Object.create(new Collection());

        return spaces;
    }
);