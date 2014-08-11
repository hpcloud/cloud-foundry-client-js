/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
        'underscore',
        './collection'],
    function (_, Collection) {

        var jobs = function (api) {
            this.api = api;
            this.collection = 'jobs';
        };

        jobs.prototype = Object.create(new Collection());
        jobs.prototype.getSummary = null;
        jobs.prototype.delete_ = null;
        jobs.prototype.update = null;
        jobs.prototype.create = null;
        jobs.prototype.list = null;

        return jobs;
    }
);