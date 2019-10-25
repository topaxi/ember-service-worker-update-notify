import Ember from 'ember'
import Service from '@ember/service'
import Evented from '@ember/object/evented';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency'
import serviceWorkerHasUpdate from '../utils/service-worker-has-update'

const configKey = 'ember-service-worker-update-notify'

async function update() {
  if (Ember.testing) {
    return
  }

  const reg = await navigator.serviceWorker.register(
    '{{ROOT_URL}}{{SERVICE_WORKER_FILENAME}}',
    { scope: '{{ROOT_URL}}' },
  )

  reg.update()
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
    this._attachUpdateHandler();
    this.pollingTask.perform();
  }
});
