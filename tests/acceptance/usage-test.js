import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import {
  setupServiceWorkerUpdater,
  serviceWorkerUpdate,
} from 'ember-service-worker-update-notify/test-support/updater';

const selector = '[data-test-update]';
const aggressiveSelector = '[data-test-update-overridden]';

function waitMs(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });
}

module('Acceptance | usage', function(hooks) {
  setupApplicationTest(hooks);

  module('without setup', function(hooks) {
    hooks.beforeEach(async function() {
      await visit('/');
    });

    test('the notifier is not visible', function(assert) {
      assert.dom(selector).doesNotExist();
    });

    module('an update is ready', function() {

      test('the notifier still cannot become visible', async function(assert) {
        await serviceWorkerUpdate();

        assert.dom(selector).doesNotExist();
      });
    });
  });

  module('with setup', function(hooks) {
    setupServiceWorkerUpdater(hooks);

    hooks.beforeEach(function() {
      // don't await, because the concurrency tasks
      // will block settledState from occurring.
      visit('/');
    });

    hooks.afterEach(async function() {
      await serviceWorkerUpdate();
    });

    test('the notifier is not visible', function(assert) {
      assert.dom(selector).doesNotExist();
    });

    module('an update is ready', function() {

      test('the notifier can become visible', async function(assert) {
        await serviceWorkerUpdate();

        assert.dom(selector).exists();
      });
    });

    module('after some time...', function() {
      test('the fast notifier does not render before an update', async function(assert) {
        assert.dom(aggressiveSelector).doesNotExist();

        serviceWorkerUpdate();

        assert.dom(aggressiveSelector).doesNotExist();
        await waitMs(1100);
        assert.dom(aggressiveSelector).exists();
      });

      test('a notifier can be controlled be the environment config', async function(assert) {
        assert.dom(selector).doesNotExist();

        serviceWorkerUpdate();

        assert.dom(selector).doesNotExist();
        await waitMs(1100);
        assert.dom(selector).doesNotExist();
        await waitMs(1100);
        assert.dom(selector).exists();
      });
    });
  });

});
