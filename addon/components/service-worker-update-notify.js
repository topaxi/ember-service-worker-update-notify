import Component from '@ember/component';
import layout from '../templates/components/service-worker-update-notify';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  tagName: '',
  serviceWorkerUpdate: service(),

  hasUpdate: false,

  init() {
    this._super(...arguments);
    this._updateHandler = () => this.set('hasUpdate', true);
    this.serviceWorkerUpdate.on('update', this._updateHandler);
  },

  willDestroy() {
    this._super(...arguments);
    this.serviceWorkerUpdate.off('update', this._updateHandler);
  }
});
