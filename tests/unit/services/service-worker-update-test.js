import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  setupServiceWorkerUpdater,
  serviceWorkerUpdate,
} from 'ember-service-worker-update-notify/test-support/updater';

module('Unit | Service | service-worker-update', function(hooks) {
  setupTest(hooks);
  setupServiceWorkerUpdater(hooks);

  test('hasUpdate property', async function(assert) {
    let service = this.owner.lookup('service:service-worker-update');
    assert.notOk(service.hasUpdate);

    await serviceWorkerUpdate();
    assert.ok(service.hasUpdate);
  });

  test('update event', async function(assert) {
    assert.expect(1);

    let service = this.owner.lookup('service:service-worker-update');
    service.one('update', () => assert.ok(true));

    await serviceWorkerUpdate();
  });
});
