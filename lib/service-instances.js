/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    'jquery',
    './collection'],
    function ($, Collection) {

        var service_instances = function (api) {
            this.api = api;
            this.collection = 'service_instances';
        };

        service_instances.prototype = Object.create(new Collection());

        service_instances.prototype.getServiceBindings = function (guid, done) {

            this.api.get('/v2/service_instances/' + guid + '/service_bindings?inline-relations-depth=2', {status_code: 200}, function (err, res) {
                if (err) {
                    return done(err, res);
                }
                done(null, res.body);
            });
        };

        return service_instances;
    }
);
