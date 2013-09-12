/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './lib/apps',
    './lib/services',
    './lib/spaces',
    './lib/organizations',
    './lib/http-client',
    './vendor/event-emitter/event-emitter.4.0.3.min'],
    function (Apps, Services, Spaces, Organizations, HttpClient, EventEmitter) {

        var api = function (api_endpoint, options) {

            options = options || {};

            this.api_endpoint = api_endpoint;
            this.http_client = new HttpClient();
            this.token = options.token || null;
            this.scopes = options.scopes || 'scim.write';
            this.redirect_uri = options.redirect_uri || null;
            this.apps = new Apps(this);
            this.services = new Services(this);
            this.spaces = new Spaces(this);
            this.organizations = new Organizations(this);
        };

        // on 401 equiv
        //  get /info
        //  redirect to info.authorization_endpoint read%20write&redirect_uri=/test

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

            authorize: function () {

                if (this.authorizing) {return;}

                var self = this;
                this.token = null;
                this.authorizing = true;

                this.get('/info', {}, function (err, res) {
                    var oauth_url = res.body.authorization_endpoint + '/oauth/authorize?response_type=token&client_id=vmc&scope=' + self.scopes + '&redirect_uri=' + self.redirect_uri;
                    window.location = encodeURI(oauth_url);
                });
            },

            processResponse: function (options, err, res, done) {
                if (res.status_code === 401) {return this.authorize();} // auth check first because jquery considers 401 an error
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