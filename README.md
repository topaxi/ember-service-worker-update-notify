# ember-service-worker-update-notify

Adds an `{{service-worker-update-notify}}` component which displays
a reload link if the service-worker has found an update.

Overwrite the default message using the component in block form:
```handlebars
{{#service-worker-update-notify}}
  <a class="service-worker-update-notify" href="">
    A new version is available, click here to update.
  </a>
{{/service-worker-update-notify}}
```

## Installation

* `ember install ember-service-worker-update-notify`

### Local installation

* `git clone <repository-url>` this repository
* `cd ember-service-worker-update-notify`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
