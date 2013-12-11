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

        return organizations;
    }
);
