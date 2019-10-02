import Ember from 'ember';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import withTestWaiter from 'ember-concurrency-test-waiter/with-test-waiter';

import layout from '../templates/components/service-worker-update-notify';
import serviceWorkerHasUpdate from '../utils/service-worker-has-update';

const configKey = 'ember-service-worker-update-notify';

async function update() {
  const reg = await navigator.serviceWorker.register(
    '{{ROOT_URL}}{{SERVICE_WORKER_FILENAME}}',
    { scope: '{{ROOT_URL}}' }
  );

  reg.update();
}

export default Component.extend({
  layout,
  tagName: '',

  // private
  hasUpdate: false,

  // public
  pollingInterval: 1200000, // 20 minutes in ms

  get config() {
    return getOwner(this).resolveRegistration('config:environment')[configKey];
  },

  init() {
    this._super(...arguments);

    // NOTE: this.attrs *shouldn't* be used
    //       as it's poorly documented.
    //       Consider moving to a glimmer component
    //       where this.args are available.
    let wasPassedIn = Boolean(this.attrs.pollingInterval);

    if (wasPassedIn) {
      return;
    }

    let config = this.config;
    if (config && config.pollingInterval) {
      this.set('pollingInterval', config.pollingInterval);
    }
  },

  didInsertElement() {
    this._super(...arguments);

    if (Ember.testing) {
      this._attachUpdateHandler();
    } else {
      // we can't interact with service workers in
      // the way we want during testing?
      // seems like it would be complicated if we were
      // to try.
      // Also, the tasks use a while(true) loop,
      // which would prevent tests from every finishing
      this.setupTask.perform();
    }
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

  pollingTask: task(function*() {
    while (true) {
      yield update();

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
