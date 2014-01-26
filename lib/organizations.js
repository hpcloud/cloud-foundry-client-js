/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './collection'],
    function (Collection) {

        var organizations = function (api) {
            this.api = api;
            this.collection = 'organizations';
        };

        organizations.prototype = Object.create(new Collection());

        organizations.prototype.users = function (guid) {

            var organization_users_collection = new Collection();

            organization_users_collection.api = this.api;
            organization_users_collection.collection = this.collection + '/' + guid + '/users';

            return organization_users_collection;
        };

        organizations.prototype.domains = function (guid) {

            var organization_domains_collection = new Collection();

            organization_domains_collection.api = this.api;
            organization_domains_collection.collection = this.collection + '/' + guid + '/domains';

            return organization_domains_collection;
        };

        organizations.prototype.private_domains = function (guid) {

            var organization_private_domains_collection = new Collection();

            organization_private_domains_collection.api = this.api;
            organization_private_domains_collection.collection = this.collection + '/' + guid + '/private_domains';

            return organization_private_domains_collection;
        };

        return organizations;
    }
);
