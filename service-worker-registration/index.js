import { addSuccessHandler } from 'ember-service-worker/service-worker-registration'

window.hasServiceWorkerUpdate =
  'Promise' in window
    ? new Promise(function hasServiceWorkerUpdate(resolve) {
        addSuccessHandler(function emberServiceWorkerUpdateNotifyRegistration(
          reg,
        ) {
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
    : {
        then: function() {
          return false
        },
      }
