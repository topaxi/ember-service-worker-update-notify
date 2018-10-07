import { addSuccessHandler } from 'ember-service-worker/service-worker-registration'

function hasServiceWorkerUpdate(resolve) {
  console.log('invoked');
  addSuccessHandler(function(reg) {
    console.log('success');
    reg.onupdatefound = function() {
      console.log('update found');
      const { installing } = reg;

      installing.onstatechange = function() {
        console.log('state changed');
        if (installing.state === 'activated') {
          resolve(navigator.serviceWorker.controller !== null)
        }
      }
    }
  });
}

// https://caniuse.com/#search=Promise
// IE11 (2.5%) and Opera Mini (2.3%) do not support Promises
const arePromisesSupported = 'Promise' in window;
const disablePolyfill = ({
  then: function() {
    return false;
  }
});

console.log('running');

window.hasServiceWorkerUpdate =
  arePromisesSupported
  ? new Promise(hasServiceWorkerUpdate)
  : disablePolyfill

