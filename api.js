/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    'cloud-foundry-client/lib/apps',
    'cloud-foundry-client/lib/services',
    'cloud-foundry-client/lib/spaces',
    'cloud-foundry-client/lib/organizations',
    'cloud-foundry-client/lib/http-client'],
    function (Apps, Services, Spaces, Organizations, HttpClient) {

        var api = function (api_endpoint, token) {
            this.api_endpoint = api_endpoint;
            this.http_client = new HttpClient();
            this.token = token;
            this.apps = new Apps(this);
            this.services = new Services(this);
            this.spaces = new Spaces(this);
            this.organizations = new Organizations(this);
        };

        api.prototype = {

            makeAuthorizationHeader: function () {
                return 'bearer ' + this.token;
            },

            addAuthorizationHeaderToOptions: function (options) {
                options.headers['Authorization'] = this.makeAuthorizationHeader();
            },

            normalizeOptions: function (options) {

                options = options || {};
                options.headers = options.headers || {};

                if (this.token) {
                    this.addAuthorizationHeaderToOptions(options);
                }

                return options;
            },

            processResponse: function (options, err, res, done) {
                if (err) {return done(err);}
                if (options.status_code && options.status_code !== res.status_code) {return done(new Error('Status: ' + res.statusCode + '. Response: ' + res.body));}

                done(null, res);
            },

            executeRequest: function (path, options, done) {

                var self = this;
                this.http_client.request(
                    this.api_endpoint + path + (options.query ? options.query : ''),
                    options,
                    function (err, res) {
                        self.processResponse(options, err, res, done);
                    }
                );
            },

            get: function (path, options, done) {

                options = this.normalizeOptions(options);
                options.verb = 'GET';

                this.executeRequest(path, options, done);
            },

            delete_: function (path, options, done) {

                options = this.normalizeOptions(options);
                options.verb = 'DELETE';

                this.executeRequest(path, options, done);
            },

            put: function (path, options, done) {

                options = this.normalizeOptions(options);
                options.verb = 'PUT';

                this.executeRequest(path, options, done);
            },

            post: function (path, options, done) {

                options = this.normalizeOptions(options);
                options.verb = 'POST';

                this.executeRequest(path, options, done);
            }
        };

        return api;
    }
);