# ember-service-worker-update-notify

Adds a `<ServiceWorkerUpdateNotify />` component which displays
a reload link if the service-worker has found an update.

Overwrite the default message using the component in block form:

```handlebars
<ServiceWorkerUpdateNotify>
  <a class="service-worker-update-notify" href={{this.router.currentURL}}>
    A new version is available, click here to update.
  </a>
</ServiceWorkerUpdateNotify>
```

Additionally, the frequency of how often a check will be made for an update
can be configured via the `pollingInterval` argument.
The time is measured in milliseconds. The default is 1200000 (20 minutes).

```handlebars
<ServiceWorkerUpdateNotify @pollingInterval={{2000}}>
  <a class="service-worker-update-notify" href={{this.router.currentURL}}>
    A new version is available, click here to update.
  </a>
</ServiceWorkerUpdateNotify>
```

The poll interval can also be configured in your `config/environment.js` with:
```js
module.exports = function(environment) {
  let ENV = {
    'ember-service-worker-update-notify': {
      pollingInterval:1200000 // Default is 20min
    }
  };

 return ENV;
};
```

## Testing in Your App

Testing this in your app should mainly be concerned with presence
and and what it looks like.

During testing, the polling will be disabled,
and the reveal of the "New version available" content
is controlled by a promise set on the `window`.
In your tests, two helpers will aid you in asserting
presence and appearance: `setupServiceWorkerUpdater`,
and `hasServiceWorkerUpdate`.

```js
// ...
import {
  setupServiceWorkerUpdater,
  hasServiceWorkerUpdate
} from 'ember-service-worker-update-notify/test-support/updater';

module('Application | Index', function(hooks) {
  setupApplicationTest(hooks);
  setupServiceWorkerUpdater(hooks);

  test('the update is shown', async function(assert) {
    // assert that the content is not shown

    await serviceWorkerUpdate();

    // assert that the content is shown

  });
});
```


## Installation

```bash
yarn add --dev ember-concurrency # peer-dependency
yarn add --dev ember-service-worker-update-notify
```

### Local installation

- `git clone <repository-url>` this repository
- `cd ember-service-worker-update-notify`
- `npm install`

### Linting

- `npm run lint:hbs`
- `npm run lint:js`
- `npm run lint:js -- --fix`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

This project is licensed under the [MIT License](LICENSE.md).
