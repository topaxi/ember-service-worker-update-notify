import Ember from 'ember';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import withTestWaiter from 'ember-concurrency-test-waiter/with-test-waiter';

import layout from '../templates/components/service-worker-update-notify'
import serviceWorkerHasUpdate from '../utils/service-worker-has-update'

export default Component.extend({
  layout,
  pollingInterval: 1200000, // 20 minutes in ms

  tagName: '',

  hasUpdate: false,

  didInsertElement() {
    this._super(...arguments);

    if (Ember.testing) {
      this._attachUpdateHandler();
    } else {
      this.setupTask.perform();
    }
  },

  // could be overridden for testing.
  // called every this.pollingInterval
  async update() {
    const reg = await navigator.serviceWorker.register(
      '{{ROOT_URL}}{{SERVICE_WORKER_FILENAME}}',
      { scope: '{{ROOT_URL}}' }
    );

    reg.update();
  },

  /*********************************************************
   * Private APIs
   ********************************************************/

  /**
   * Delay attaching the updateHandler to prevent users from
   * seeing a new build notification immediately on page load.
   */
  setupTask: withTestWaiter(task(function*() {
    const hasServiceWorker = 'serviceWorker' in navigator;
    const supportsPromises = 'Promise' in window;

    if (hasServiceWorker && supportsPromises) {
      yield timeout(this.pollingInterval);
      this._attachUpdateHandler();

      const polling = this.pollingTask.perform();

      this.set('polling', polling);
    }
  })),

  pollingTask: withTestWaiter(task(function*() {
    while (true) {
      yield this.update();

      yield timeout(this.pollingInterval);
    }
  })),

  _attachUpdateHandler() {
    serviceWorkerHasUpdate().then(hasUpdate => {
      if (!isEmpty(this.polling)) {
        this.polling.cancel();
      }

      this.set('hasUpdate', hasUpdate);
    });
  }
});
