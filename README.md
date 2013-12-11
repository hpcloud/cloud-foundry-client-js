## Cloud Foundry Client

A JavaScript based Cloud Foundry Api client targeting the v2 api.

The client is intended to be used by client-side JavaScript apps (such as those using Backbone, Knockout and Angular etc.)
and will evolve with that in mind.


## Status

The client is under heavy development so expect some issues. It would be great to see it evolve in to a comprehensive client
covering the entire Cloud Foundry Api but initially functionality will be added in the order that we need it for in other projects.


## Dependencies

* RequireJS (or AMD compatible loader)
* jQuery
* Underscore (or lodash)

Dependencies are bundled in the ```/vendor``` directory.

## Notes About Cross Domain Requests

Cloud Foundry v2 doesn't support cross domain requests out of the box. Until it does then there are a few ways to work
around it:

 1. Run your browser with cross domain security disabled (not recommended outside of development). In Chrome this can be
 achieved with the --disable-web-security flag.

  If you do this you'll notice that Cloud Foundry will throw a 500 internal server error when any API call is made with
  mismatched host and referrer headers, which makes it impossible to run cross domain requests (even if the browser
  allows them).

  You can patch your ```cloud_controller_ng``` by inserting the following code in ```line 50``` of ```cloud_controller_ng/lib/sinatra/vcap.rb```:

  ```
  # Allow browser based clients to talk to the CC Api across domains
  # This is not a full cross domain solution but it prevents Sinatra throwing a 500 error
  # when referrer and host headers do not match.
  # See https://github.com/sinatra/sinatra/issues/747

  app.set :protection, :except => [:remote_referrer, :json_csrf]
  
  ```

2. Use a reverse proxy to avoid cross domain requests all together.

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
that is capable of pulling the token from the url (see ```/examples/oauth.html```): 

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