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

            var http_client = function () {

            };

            http_client.prototype = {

                request: function (url, options, done) {
                    $.ajax({
                            url: url,
                            accept: "application/json",
                            contentType: options.data ? "application/json" : "",
                            dataType: "json",
                            type: options.verb,
                            async: true,
                            data: options.data ? JSON.stringify(options.data) : null,
                            timeout: options.timeout || 30000,
                            headers: options.headers,
                            processData: false,
                            cache: false,
                            complete: function (jqXHR, textStatus) {

                                var response = {
                                    status_code: jqXHR.status,
                                    body: parseResponse(jqXHR),
                                    headers: Utils.parseHttpHeaders(jqXHR.getAllResponseHeaders())
                                };

                                if (jqXHR.status === 401 || textStatus === "success" ||
                                    textStatus === "nocontent" || textStatus === "parsererror") {
                                    done(null, response);
                                } else {
                                    done(new Error(textStatus), response);
                                }
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

    var http_client = function () {

    };

    http_client.prototype = {

        request: function (url, options, done) {

            Request({
                url: url,
                method: options.verb,
                headers: options.headers,
                json: options.data ? options.data : null,
                timeout: options.timeout || 10000
            }, function (err, res) {
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