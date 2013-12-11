/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    '../api',
    '../lib/collection',
    '../lib/page',
    'test-data',
    'test-utils'],
    function (CFApi, Collection, Page, TestData, TestUtils) {

        var cf_api = new CFApi(TestUtils.api_endpoint, {token: TestUtils.api_token});
        var collection = new Collection();
        collection.api = cf_api;

        describe('collection', function () {

            describe('#list', function () {

                before(function () {
                    TestUtils.stubExecuteRequest(cf_api, TestData.apps_list);
                });

                it('should return a page', function (done) {
                    collection.list({}, function (err, page) {
                        if (err) {return done(err);}
                        expect(page).to.be.a(Page);
                        done();
                    });
                });

                it('should have next page when next_url is available', function (done) {
                    collection.list({}, function (err, page) {
                        if (err) {return done(err);}
                        expect(page.hasNextPage()).to.be(true);
                        done();
                    });
                });

                it('should have previous page when prev_url is available', function (done) {
                    collection.list({}, function (err, page) {
                        if (err) {return done(err);}
                        expect(page.hasPrevPage()).to.be(true);
                        done();
                    });
                });
            });

            describe('#get', function () {

                before(function () {
                    TestUtils.stubExecuteRequest(cf_api, TestData.app_get);
                });

                it('should return a resource', function (done) {
                    collection.get(TestData.app_get.metadata.guid, {}, function (err, resource) {
                        if (err) {return done(err);}
                        expect(resource.metadata).to.be.ok();
                        expect(resource.entity).to.be.ok();
                        done();
                    });
                });
            });
        });
    }
);