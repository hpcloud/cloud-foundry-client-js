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


## Issues

Cloud Foundry mainline will throw a 500 internal server error when any API call is made with mismatched host and
referrer headers, which makes it impossible to run cross domain clients like this from the browser.

You can patch your cloud_controller_ng by inserting the following code in line 50 of cloud_controller_ng/lib/sinatra/vcap.rb:

```
    # Allow browser based clients to talk to the CC Api across domains
    # This is not a full cross domain solution but it prevents Sinatra throwing a 500 error
    # when referrer and host headers do not match.
    # See https://github.com/sinatra/sinatra/issues/747

    app.set :protection, :except => [:remote_referrer, :json_csrf]
```
This will hopefully be fixed in the near future.


## Tests

0. Modify api_endpoint and api_token properties of tests/test-config.js (won't be necessary for much longer)

1. Open Chrome with '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security'

2. Open tests/test.html to run tests.


## Usage

1. Load the api object via an AMD module loader (requirejs example below):

```
    main.js

    {
        baseUrl: "js/",
        paths: {
            'cloud-foundry-client': 'lib/cloud-foundry-client'
        }
    }
```

2. Use the api object in your code - note you are responsible for providing the token as well as providing a page to redirect to
that is capable of pulling the token from the url (this is your opportunity to persist it):

```
define([
    'cloud-foundry-client/api'],
    function(CFApi){

        var cf_api = new CFApi(api_endpoint, {
            token: Utils.getCookie('cf_token'),
            redirect_uri: html_root + 'oauth.html'
            });

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
});

```

## Contributing

Pull requests and issues welcome!