import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { getOwner } from '@ember/application';
import { task, timeout } from 'ember-concurrency';

import layout from '../templates/components/service-worker-update-notify'
import serviceWorkerHasUpdate from '../utils/service-worker-has-update'


export default Component.extend({
  layout,

  tagName: '',

  hasUpdate: false,

  init() {
    this._super(...arguments)
    this.set('pollingInterval', getOwner(this).resolveRegistration("config:environment")['ember-service-worker-update-notify'].pollingInterval)

  },

  /**
   * Delay attaching the updateHandler to prevent users from
   * seeing a new build notification immediately on page load.
   */
  setupTask: task(function*() {
    const hasServiceWorker = 'serviceWorker' in navigator;
    const supportsPromises = 'Promise' in window;

    if (hasServiceWorker && supportsPromises) {
      yield timeout(this.pollingInterval);
      this._attachUpdateHandler();

      const polling = this.pollingTask.perform();

      this.set('polling', polling);
    }
  }).on('didInsertElement'),

  pollingTask: task(function*() {
    while (true) {
      const reg = yield navigator.serviceWorker.register('{{ROOT_URL}}{{SERVICE_WORKER_FILENAME}}', { scope: '{{ROOT_URL}}' });

      reg.update();

      yield timeout(this.pollingInterval);
    }
  }),

  _attachUpdateHandler() {
    serviceWorkerHasUpdate().then(hasUpdate => {
      if (!isEmpty(this.polling)) {
        this.polling.cancel();
      }

      this.set('hasUpdate', hasUpdate);
    });
  }
});
