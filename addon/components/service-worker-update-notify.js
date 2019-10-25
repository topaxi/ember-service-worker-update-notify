import Ember from 'ember';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

import layout from '../templates/components/service-worker-update-notify';
import serviceWorkerHasUpdate from '../utils/service-worker-has-update';

const configKey = 'ember-service-worker-update-notify';

async function update() {
  if (Ember.testing) {
    return;
  }

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
    //
    // eslint-disable-next-line ember/no-attrs-in-components
    let wasPassedIn = this.attrs.hasOwnProperty('pollingInterval');

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

    this.setup();
  },

  /*********************************************************
   * Private APIs
   ********************************************************/

  setup() {
    this.pollingTask.perform();
  },

  pollingTask: task(function*() {
    yield timeout(this.pollingInterval);
    // Delay attaching the updateHandler to prevent users from
    // seeing a new build notification immediately on page load.
    this._attachUpdateHandler();

    while (true) {
      yield update();

      yield timeout(this.pollingInterval);
    }
  }),

  _attachUpdateHandler() {
    serviceWorkerHasUpdate().then(hasUpdate => {
      this.pollingTask.cancelAll();

      this.set('hasUpdate', hasUpdate);
    });
  }
});
