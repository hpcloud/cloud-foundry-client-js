/**
 * Copyright (c) ActiveState 2013 - ALL RIGHTS RESERVED.
 */

define([],
    function () {

        return {

            api_endpoint: 'https://api.stackato-pn4x.local',

            api_token: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4ZjY1ZGJlNS03YWQxLTQ2MDYtODBkOS0zZTkyMmFhODc4Y2YiLCJzdWIiOiI1NTYxMDViMS05NzVhLTQ2M2MtYjI2MS1kMmM0MzRkOWU3MzgiLCJzY29wZSI6WyJzY2ltLnJlYWQiLCJzY2ltLnVzZXJpZHMiLCJjbG91ZF9jb250cm9sbGVyLmFkbWluIiwicGFzc3dvcmQud3JpdGUiLCJzY2ltLndyaXRlIiwiY2xvdWRfY29udHJvbGxlci53cml0ZSIsIm9wZW5pZCIsImNsb3VkX2NvbnRyb2xsZXIucmVhZCJdLCJjbGllbnRfaWQiOiJ2bWMiLCJjaWQiOiJ2bWMiLCJ1c2VyX2lkIjoiNTU2MTA1YjEtOTc1YS00NjNjLWIyNjEtZDJjNDM0ZDllNzM4IiwidXNlcl9uYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluIiwiaWF0IjoxMzc5MDMzMDUyLCJleHAiOjEzNzkwNzYyNTIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91YWEvb2F1dGgvdG9rZW4iLCJhdWQiOlsic2NpbSIsIm9wZW5pZCIsImNsb3VkX2NvbnRyb2xsZXIiLCJwYXNzd29yZCJdfQ.z60z3J6QUIFYbUhGddRSxiJzcIDQbjqBDBXIMyZr3U0',

            stubExecuteRequest: function (cf_api, response_data) {
                cf_api.executeRequest = function (path, options, done) {
                    setTimeout(function () {
                        done(null, {body:response_data});
                    }, 10);
                };
            }
        }
    }
);