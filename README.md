## Cloud Foundry Client

A JavaScript based Cloud Foundry Api client targeting the v2 api.

The client is intended to be used by client-side JavaScript apps (such as those using Backbone, Knockout and Angular etc.)
and will evolve with that intention in mind.

## Status

The client is under heavy development so expect some issues. It would be great to see it evolve in to a comprehensive client
covering the entire Cloud Foundry Api but initially functionality will be added in the order that we need it for in other projects.

## Dependencies

RequireJS (or AMD compatible loader)
jQuery
Underscore (or lodash)

## Usage

1. Load the api object via an AMD module loader (requirejs example below):

    main.js

    {
        baseUrl: "js/",
        paths: {
            cf_client: 'lib/cloud-foundry-client'
        }
    }

2. Use the api object in your code:

    var cf_api = new CFApi('https://api.run.pivotal.io', 'your_token');

    cf_api.apps.list({
            paging: {
                'results-per-page': 1
            },
            filter: {
                name: "instances",
                value: ">1"
            }},
        function (err, page) {
            if (err) {return console.log(err);}

            console.log(page.data);

            if (page.hasNextPage()) {
                page.getNextPage(function (err, next_page) {
                    ...
                });
            }
        }
    );

## Contributing

Pull requests and issues welcome!