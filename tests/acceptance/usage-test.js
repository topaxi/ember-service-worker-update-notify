import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import {
  setupServiceWorkerUpdater,
  hasServiceWorkerUpdate,
} from 'ember-service-worker-update-notify/test-support/updater';

const selector = '[data-test-update]';

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
        await hasServiceWorkerUpdate();

        assert.dom(selector).doesNotExist();
      });
    });
  });

  module('with setup', function(hooks) {
    setupServiceWorkerUpdater(hooks);

    hooks.beforeEach(async function() {
      await visit('/');
    });

    test('the notifier is not visible', function(assert) {
      assert.dom(selector).doesNotExist();
    });

    module('an update is ready', function() {

      test('the notifier can become visible', async function(assert) {
        await hasServiceWorkerUpdate();

        assert.dom(selector).exists();
      });
    });
  });

});
