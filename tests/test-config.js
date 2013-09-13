/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

require.config({
    baseUrl: "./",
    paths: {
        jquery: '../vendor/jquery/jquery-1.10.1.min',
        underscore: '../vendor/underscore/underscore-1.4.4.min'
    }
});

require([
    'test.apps',
    'test.collection'
], function () {
    mocha.checkLeaks();
    mocha.globals(['jQuery', '_']);
    mocha.run();
});