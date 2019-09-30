# ember-service-worker-update-notify

Adds an `{{service-worker-update-notify}}` component which displays
a reload link if the service-worker has found an update.

Overwrite the default message using the component in block form:

```handlebars
<ServiceWorkerUpdateNotify>
  <a class="service-worker-update-notify" href="">
    A new version is available, click here to update.
  </a>
</ServiceWorkerUpdateNotify>
```

The poll interval can be configured with:
```handlebars
<ServiceWorkerUpdateNotify @pollingInterval={{yourTimeout}}/>

```

## Installation

```bash
ember install ember-concurrency
ember install ember-service-worker-update-notify
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
