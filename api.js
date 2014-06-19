/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
    typeof window === 'undefined' ? 'events' : 'event-emitter',
    './lib/apps',
    './lib/services',
    './lib/service-instances',
    './lib/user-provided-service-instances',
    './lib/service-plans',
    './lib/service-bindings',
    './lib/spaces',
    './lib/users',
    './lib/organizations',
    './lib/domains',
    './lib/shared-domains',
    './lib/private-domains',
    './lib/routes',
    './lib/quota-definitions',
    './lib/http-client'],
    function (Events, Apps, Services, ServiceInstances, UserProvidedServiceInstances, ServicePlans, ServiceBindings, Spaces, Users, Organizations, Domains, SharedDomains, PrivateDomains, Routes, QuotaDefinitions, HttpClient) {

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
            this.user_provided_service_instances = new UserProvidedServiceInstances(this);
            this.service_plans = new ServicePlans(this);
            this.service_bindings = new ServiceBindings(this);
            this.spaces = new Spaces(this);
            this.organizations = new Organizations(this);
            this.domains = new Domains(this);
            this.shared_domains = new SharedDomains(this);
            this.private_domains = new PrivateDomains(this);
            this.routes = new Routes(this);
            this.quota_definitions = new QuotaDefinitions(this);

            this.initialize();
        };

        if (typeof window === 'undefined') {
            api.prototype.__proto__ = Events.EventEmitter.prototype;
        } else {
            api.prototype = Object.create(new Events());
        }

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

        var makeResponseError = function (err, res) {
            if (!err) {
                err = new Error(makeErrorMessageFromResponse(res));
            }
            err.status_code = res ? res.status_code : 0;
            return err;
        };

        api.prototype.initialize = function () {
            /* faux-constructor to use as an extension point for derived clients */
        };

        api.prototype.makeAuthorizationHeader = function () {
            return 'bearer ' + this.token;
        };

        api.prototype.addAuthorizationHeaderToOptions = function (options) {
            options.headers['Authorization'] = this.makeAuthorizationHeader();
        };

        api.prototype.normalizeOptions = function (options) {

            options = options || {};
            options.headers = options.headers || {};
            options.global = typeof options.global === 'undefined' ? true : options.global;

            if (this.token) {
                this.addAuthorizationHeaderToOptions(options);
            }

            return options;
        };

        api.prototype.getAuthorizationEndpoint = function (done) {

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
        };

        api.prototype.authorize = function () {
            if (typeof window !== 'undefined') {
                this.authorizeBrowser();
            } else {
                this.authorizeNodejs();
            }
        };

        api.prototype.authorizeBrowser = function () {

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
        };

        api.prototype.authorizeNodejs = function (res, done) {

            /**
             * 1. If acting on behalf of a user e.g. just passing through a user token then a 401 is an error that should bubble out to the user
             * 2. If acting as a resource server a 401 should trigger a refresh token attempt and failing that it should try to re-authenticate using client credentials
             *
             * Assume 1. for now until 2. is implemented. Users of this lib could override this function to patch in their desired behaviour.
             */
            if (done) {
                done(new Error(makeErrorMessageFromResponse(res)), res);
            }
        };

        api.prototype.triggerGlobalError = function (err, options, res) {
            if (options.global) {
                this.emit('http_error', err, res, options);
            }
        };

        api.prototype.processResponse = function (options, err, res, done) {

            if (err) {
                err = makeResponseError(err, res);
                this.triggerGlobalError(err, options, res);
                return done(err, res);
            }

            if (res.status_code === 401 && !options.ignore_unauthorized && typeof window !== 'undefined') {return this.authorizeBrowser();}
            if (res.status_code === 401 && !options.ignore_unauthorized && typeof window === 'undefined') {return this.authorizeNodejs(res, done);}

            if ((options.status_code && options.status_code !== res.status_code) ||
                (options.status_codes && options.status_codes.indexOf(res.status_code) === -1)) {
                var error = makeResponseError(null, res);
                this.triggerGlobalError(error, options, res);
                return done(error, res);
            }

            this.marshalResponse(options, res, done);
        };

        api.prototype.marshalResponse = function (options, res, done) {
            /* this is effectively a no-op implementation. derived clients can use it to modify the response. */
            var self = this;
            setTimeout(function () {
                done.call(self, null, res);
            }, 1);
        };

        api.prototype.marshalRequest = function (url, options, done) {
            /* this is effectively a no-op implementation. derived clients can use it to modify the request. */
            var self = this;
            setTimeout(function () {
                done.call(self, null, url, options);
            }, 1);
        };

        api.prototype.executeRequest = function (path, options, done) {

            // Allow the special case where api components may need to talk to the UAA with it's own host.
            var prepend_host = true;
            if (path.indexOf('http') !== -1) {
                prepend_host = false;
            }

            var self = this;
            this.marshalRequest(path, options, function (err, path, options) {
                if (err) {return done(err);}

                self.http_client.request(
                    (prepend_host ? self.api_endpoint : '') + path + (options.query ? options.query : ''),
                    options,
                    function (err, res) {
                        self.processResponse(options, err, res, done);
                    }
                );
            });
        };

        api.prototype.getApiInfo = function (options, done) {

             if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }

            options = options || {};
            options.status_code = 200;

            this.get('/v2/info', options, function (err, res) {
                done(err, res ? res.body : null);
            });
        };

        api.prototype.get = function (path, options, done) {

            options = this.normalizeOptions(options);
            options.verb = 'GET';
            options.path = path;

            if (!options.status_code && !options.status_codes) {
                options.status_code = 200;
            }

            this.executeRequest(path, options, done);
        };

        api.prototype.delete_ = function (path, options, done) {

            options = this.normalizeOptions(options);
            options.verb = 'DELETE';
            options.path = path;

            if (!options.status_code && !options.status_codes) {
                options.status_code = 200;
            }

            this.executeRequest(path, options, done);
        };

        api.prototype.put = function (path, options, done) {

            options = this.normalizeOptions(options);
            options.verb = 'PUT';
            options.path = path;

            if (!options.status_code && !options.status_codes) {
                options.status_code = 200;
            }

            this.executeRequest(path, options, done);
        };

        api.prototype.post = function (path, options, done) {

            options = this.normalizeOptions(options);
            options.verb = 'POST';
            options.path = path;

            if (!options.status_code && !options.status_codes) {
                options.status_code = 201;
            }

            this.executeRequest(path, options, done);
        };

        return api;
    }
);
