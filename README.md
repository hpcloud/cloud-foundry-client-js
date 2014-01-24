## Cloud Foundry Client

A JavaScript based Cloud Foundry Api client targeting the v2 api.

This client supports running in the browser via an AMD compatible loader (such as requirejs) and on the server under Node.js

## Status

The client is under heavy development so expect some issues. It would be great to see it evolve in to a comprehensive client
covering the entire Cloud Foundry Api but initially functionality will be added in the order that we need it for in other projects.

## Dependencies

### Browser Dependencies

* RequireJS (or AMD compatible loader)
* jQuery (exported as 'jquery')
* Underscore (exported as 'underscore')
* Event Emitter (exported as 'event-emitter')

Browser dependencies must be pulled in via your AMD loader e.g. if using requirejs you would configure your paths as:

```
paths:{
    jquery: 'cloud-foundry-client/vendor/jquery/jquery-1.10.1.min',
    underscore: 'cloud-foundry-client/vendor/underscore/underscore-1.4.4.min',
    'event-emitter': 'cloud-foundry-client/vendor/event-emitter/event-emitter.4.0.3.min',
}
```

You may point these paths at your own copies of the dependencies if you're already using them elsewhere in your project.

Browser dependencies are bundled in the ```/vendor``` directory.

### Node.js Dependencies

* Request
* Underscore (or lodash)

Node.js dependencies are pulled in via NPM

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

### Browser Tests

Open ```tests/test.html```

### Node.js Tests

Run ```npm run-script test```

## Usage

### Browser Usage

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

### Node.js Usage

1. ```npm install cloud-foundry``` (or add 'cloud-foundry' as a dependency in your package.json)

2. Use the api object in your code - note that authentication isn't yet supported for Node.js so an expired/invalid token
will bubble out as an error. We would like to add support for refresh tokens and authentication via client credentials
at some stage:

 ```
 var CloudFoundryApi = require('cloud-foundry');

 var cf_api = new CloudFoundryApi(api_endpoint, {token: 'foobar'});

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

 ```

## TODO:

1. Better test coverage

2. Implement support for refresh tokens

3. Implement authentication via client credentials (for resource servers) when running under Node.js

## Contributing

Pull requests and issues welcome!