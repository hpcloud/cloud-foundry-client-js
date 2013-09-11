/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([],
    function () {

        return {

            /**
             * @description Parses a string of HTTP headers from jquery to a dictionary of key/values.
             * @param {string} httpHeaders The HTTP headers string to process.
             * @returns {Object} The HTTP headers as a dictionary of key/values.
             */
            parseHttpHeaders:function (httpHeaders) {

                var headerRegex = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg;
                var match;
                var headers = {};

                while (true) {

                    match = headerRegex.exec(httpHeaders);

                    if (!match) {
                        break;
                    } else {
                        headers[match[1].toLowerCase()] = match[2];
                    }
                }

                return headers;
            }
        };
    }
);