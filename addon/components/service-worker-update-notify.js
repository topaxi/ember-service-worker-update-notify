import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

import layout from '../templates/components/service-worker-update-notify'
import serviceWorkerHasUpdate from '../utils/service-worker-has-update'

export default Component.extend({
  layout,
  pollingInterval: 1200000, // 20 minutes in ms

  tagName: '',

  hasUpdate: false,

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
      const reg = yield navigator.serviceWorker.register('/sw.js', { scope: '/' });

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
