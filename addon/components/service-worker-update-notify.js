import Ember from 'ember'
import layout from '../templates/components/service-worker-update-notify'
import serviceWorkerHasUpdate from '../utils/service-worker-has-update'

export default Ember.Component.extend({
  layout,

  tagName: '',

  hasUpdate: false,

  didInsertElement() {
    serviceWorkerHasUpdate()
      .then(hasUpdate => {
        console.log({ hasUpdate })
        this.set('hasUpdate', hasUpdate)
      })
  },
})
