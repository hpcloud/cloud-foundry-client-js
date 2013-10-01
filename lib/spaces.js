/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    'jquery',
    './collection'],
    function ($, Collection) {

        var spaces = function (api) {
            this.api = api;
            this.collection = 'spaces';
        };

        spaces.prototype = Object.create(new Collection());

        spaces.prototype.getSummary = function (guid, done) {

            this.api.get('/v2/spaces/' + guid + '/summary', {status_code: 200}, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
            });
        };

        spaces.prototype.getUsage = function (guid, done) {
            this.api.get('/v2/spaces/' + guid + '/usage', {status_code: 200}, function (err, res) {
                if (err) {return done(err);}
                done(null, res.body);
            });
        }

        return spaces;
    }
);
