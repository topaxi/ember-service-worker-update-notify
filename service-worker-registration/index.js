import {
  addSuccessHandler
} from 'ember-service-worker/service-worker-registration'

addSuccessHandler(function emberServiceWorkerUpdateNotifyRegistration(reg) {
  window.hasServiceWorkerUpdate = new Promise(function hasServiceWorkerUpdate(resolve) {
    reg.onupdatefound = function serviceWorkerHasFoundUpdate() {
      const { installing } = reg

      installing.onstatechange = function installingServiceWorkerStateChange() {
        if (installing.state === 'installed') {
          resolve(navigator.serviceWorker.controller !== null)
        }
      }
    }
  })
})
