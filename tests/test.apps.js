/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    typeof window === 'undefined' ? 'expect.js' : 'expectjs',
    '../api',
    '../lib/page',
    './test-utils'],
    function (Expect, CFApi, Page, TestUtils) {

        if (typeof Expect === 'undefined') {Expect = window.expect}

        var cf_api = new CFApi(TestUtils.api_endpoint, {token: TestUtils.api_token});

        describe('apps', function () {

        });
    }
);