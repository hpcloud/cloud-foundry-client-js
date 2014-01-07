/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    './lib/apps',
    './lib/services',
    './lib/service-instances',
    './lib/service-plans',
    './lib/service-bindings',
    './lib/spaces',
    './lib/users',
    './lib/organizations',
    './lib/domains',
    './lib/routes',
    './lib/quota-definitions',
    './lib/http-client'],
    function (Apps, Services, ServiceInstances, ServicePlans, ServiceBindings, Spaces, Users, Organizations, Domains, Routes, QuotaDefinitions, HttpClient) {

        var api = function (api_endpoint, options) {

            options = options || {};

            this.api_endpoint = api_endpoint;
            this.authorization_endpoint = options.authorization_endpoint || null;
            this.http_client = new HttpClient();
            this.token = options.token || null;
            this.scopes = options.scopes || null;
            this.redirect_uri = options.redirect_uri || null;
            this.client_id = options.client_id || 'cf';
            this.apps = new Apps(this);
            this.users = new Users(this);
            this.services = new Services(this);
            this.service_instances = new ServiceInstances(this);
            this.service_plans = new ServicePlans(this);
            this.service_bindings = new ServiceBindings(this);
            this.spaces = new Spaces(this);
            this.organizations = new Organizations(this);
            this.domains = new Domains(this);
            this.routes = new Routes(this);
            this.quota_definitions = new QuotaDefinitions(this);

            this.initialize();
        };

        var makeErrorMessageFromResponse = function (res) {

            var response_body = res.body;
            if (typeof response_body !== 'string') {
                try {
                    response_body = JSON.stringify(response_body);
                } catch (e) {
                    /* eat it */
                }
            }

            return 'Status: ' + res.status_code + '. Response: ' + response_body;
        };

        api.prototype = {

            initialize: function () {
                /* faux-constructor to use as an extension point for derived clients */
            },

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

            getAuthorizationEndpoint: function (done) {

                var self = this;
                if (this.authorization_endpoint) {
                    setTimeout(function () {
                        done(null, self.authorization_endpoint)
                    }, 1);
                } else {
                    this.get('/info', {status_code: 200}, function (err, res) {
                        if (err) {return done(err);}
                        self.authorization_endpoint = res.body.authorization_endpoint;
                        done(null, self.authorization_endpoint);
                    });
                }
            },

            authorize: function () {

                if (this.authorizing) {return;}

                var self = this;
                this.token = null;
                this.authorizing = true;

                this.getAuthorizationEndpoint(function (err, authorization_endpoint) {

                    var oauth_url = authorization_endpoint + '/oauth/authorize?' +
                        'response_type=token&' +
                        'client_id=' + encodeURIComponent(self.client_id) + '&' +
                        'redirect_uri=' + encodeURIComponent(self.redirect_uri);

                    if (self.scopes) {
                        oauth_url = oauth_url + '&scope=' + encodeURIComponent(self.scopes);
                    }

                    window.location = oauth_url;
                });
            },

            processResponse: function (options, err, res, done) {
                // Prioritize our error condition checking over jqueries...
                if (res.status_code === 401 && !options.ignore_unauthorized) {return this.authorize();}
                if (options.status_code && options.status_code !== res.status_code) {return done(new Error(makeErrorMessageFromResponse(res)), res);}
                if (options.status_codes && options.status_codes.indexOf(res.status_code) === -1) {return done(new Error(makeErrorMessageFromResponse(res)), res);}
                if (err) {return done(err, res);}
                done(null, res);
            },

            executeRequest: function (path, options, done) {

                // Allow the special case where api components may need to talk to the UAA with it's own host.
                var prepend_host = true;
                if (path.indexOf('http') !== -1) {
                    prepend_host = false;
                }

                var self = this;
                this.http_client.request(
                    (prepend_host ? this.api_endpoint : '') + path + (options.query ? options.query : ''),
                    options,
                    function (err, res) {
                        self.processResponse(options, err, res, done);
                    }
                );
            },

            getApiInfo: function (done) {

                this.get('/v2/info', {status_code: 200}, function (err, res) {
                    done(err, res ? res.body : null);
                });
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
