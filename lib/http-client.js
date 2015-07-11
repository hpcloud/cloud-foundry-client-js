/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

// Browsers
if (typeof window !== 'undefined') {

    define([
            'jquery',
            './utils'],
        function ($, Utils) {

            /**
             * Parses the response to an HTTP request to JSON.
             * If parsing fails the original response string will be returned.
             */
            var parseResponse = function (jqXHR) {
                try {
                    return JSON.parse(jqXHR.responseText)
                } catch (e) {
                    return jqXHR.responseText;
                }
            };

            var http_client = function (options) {
                this.options = options || {};
            };

            http_client.prototype = {

                request: function (url, options, done) {
                    $.ajax({
                            url: url,
                            accept: options.accept || "application/json",
                            contentType: options.contentType || (options.data ? "application/json" : ""),
                            dataType: options.dataType || "json",
                            responseType: options.responseType || "",
                            type: options.verb,
                            async: true,
                            data: options.data ? JSON.stringify(options.data) : null,
                            timeout: options.timeout || 30000,
                            headers: options.headers,
                            processData: false,
                            cache: false,
                            success: function (data, textStatus, jqXHR) {
                                var response = {
                                    status_code: jqXHR.status,
                                    body: parseResponse(jqXHR),
                                    data: data,
                                    headers: Utils.parseHttpHeaders(jqXHR.getAllResponseHeaders())
                                };
                                done(null, response);
                            },
                            error: function(jqXHR) {
                              var response = {
                                  status_code: jqXHR.status,
                                  body: parseResponse(jqXHR),
                                  headers: Utils.parseHttpHeaders(jqXHR.getAllResponseHeaders())
                              };
                              done(null, response);
                            }}
                    );
                }
            };

            return http_client;
        }
    );

}
// Node.js
else {

    var Request = require('request');

    var http_client = function (options) {
        this.options = options || {};
    };

    http_client.prototype = {

        request: function (url, options, done) {

            var request_options = {
                url: url,
                method: options.verb,
                headers: options.headers,
                json: options.data ? options.data : null,
                timeout: options.timeout || 10000
            };

            if (this.options.ssl_cert) {
                request_options.ca = this.options.ssl_cert;
                request_options.strictSSL = true;
            }

            if (this.options.strict_ssl !== 'undefined') {
                request_options.strictSSL = this.options.strict_ssl;
            }

            Request(request_options,
                function (err, res) {
                    if (err) {return done(err);}

                    var parsed_body = res.body;
                    try {
                        parsed_body = JSON.parse(res.body);
                    } catch (e) {
                        /* eat it */
                    }

                    var response = {
                        status_code: res.statusCode,
                        body: parsed_body,
                        headers: res.headers
                    };

                    done(null, response);
                });
        }
    };

    module.exports = http_client;
}
