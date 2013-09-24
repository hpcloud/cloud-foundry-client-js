/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([
    './lib/apps',
    './lib/services',
    './lib/spaces',
    './lib/users',
    './lib/organizations',
    './lib/http-client'],
    function (Apps, Services, Spaces, Users, Organizations, HttpClient) {

        var default_scopes =
            'cloud_controller.admin ' +
                'cloud_controller.read ' +
                'cloud_controller.write ' +
                'openid ' +
                'password.write ' +
                'scim.read ' +
                'scim.userids ' +
                'scim.write';

        var api = function (api_endpoint, options) {

            options = options || {};

            this.api_endpoint = api_endpoint;
            this.authorization_endpoint = options.authorization_endpoint || null;
            this.http_client = new HttpClient();
            this.token = options.token || null;
            this.scopes = options.scopes || default_scopes;
            this.redirect_uri = options.redirect_uri || null;
            this.client_id = options.client_id || 'vmc';
            this.apps = new Apps(this);
            this.users = new Users(this);
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

            authorize: function () {

                if (this.authorizing) {return;}

                var self = this;
                this.token = null;
                this.authorizing = true;

                this.get('/info', {}, function (err, res) {

                    var oauth_url = res.body.authorization_endpoint + '/oauth/authorize?' +
                        'response_type=token&' +
                        'client_id=' + self.client_id + '&' +
                        'scope=' + self.scopes + '&' +
                        'redirect_uri=' + self.redirect_uri;

                    window.location = encodeURI(oauth_url);
                });
            },

            processResponse: function (options, err, res, done) {
                // Prioritize our error condition checking over jqueries...
                if (res.status_code === 401) {return this.authorize();}
                if (options.status_code && options.status_code !== res.status_code) {return done(new Error('Status: ' + res.status_code + '. Response: ' + res.body));}
                if (err) {return done(err);}
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