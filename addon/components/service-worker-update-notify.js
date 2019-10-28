import Component from '@ember/component';
import layout from '../templates/components/service-worker-update-notify';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  tagName: '',
  serviceWorkerUpdateNotify: service(),

  hasUpdate: false,

  init() {
    this._super(...arguments);
    this._updateHandler = () => this.set('hasUpdate', true);
    this.serviceWorkerUpdateNotify.on('update', this._updateHandler);
  },

  willDestroy() {
    this._super(...arguments);
    this.serviceWorkerUpdateNotify.off('update', this._updateHandler);
  }
});
