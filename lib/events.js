/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
        'underscore',
        './collection'],
    function (_, Collection) {

        var events = function (api) {
            this.api = api;
            this.collection = 'events';
        };

        events.prototype = Object.create(new Collection());
        events.prototype.getSummary = null;
        events.prototype.delete_ = null;
        events.prototype.create = null;
        events.prototype.update = null;

        return events;
    }
);