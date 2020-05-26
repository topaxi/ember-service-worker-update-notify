import Ember from 'ember'
import Service from '@ember/service'
import Evented from '@ember/object/evented';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency'
import serviceWorkerHasUpdate from '../utils/service-worker-has-update'

const configKey = 'ember-service-worker-update-notify';
const supportsServiceWorker = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;

async function update() {
  try {
    // FF will throw an `SecurityError: The operation is insecure.` error here when cookies are disabled/restricted.
    // So guard in a try/catch
    const reg = await navigator.serviceWorker.register(
      '{{ROOT_URL}}{{SERVICE_WORKER_FILENAME}}',
      { scope: '{{ROOT_URL}}' },
    )

    return reg.update()
  } catch(e) {
    console.error(e);
  }
}

export default Service.extend(Evented, {

  hasUpdate: false,

  pollingInterval: computed(function() {
    let config = getOwner(this).resolveRegistration('config:environment')[configKey];
    return config && config.pollingInterval || 120000;
  }),

  pollingTask: task(function* () {
    while (true) {
      yield update();

      yield timeout(this.pollingInterval);
    }
  }),

  _attachUpdateHandler() {
    serviceWorkerHasUpdate().then(hasUpdate => {
      this.pollingTask.cancelAll();

      if (hasUpdate) {
        this.set('hasUpdate', true);
        this.trigger('update');
      }
    })
  },

  init() {
    this._super(...arguments);
    if (typeof FastBoot === 'undefined') {
      this._attachUpdateHandler();
      if (!Ember.testing && supportsServiceWorker) {
        this.pollingTask.perform();
      }
    }
  }
});
