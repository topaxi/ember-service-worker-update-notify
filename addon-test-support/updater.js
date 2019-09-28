import RSVP from 'rsvp';
import { settled } from '@ember/test-helpers';

export function setupServiceWorkerUpdater(hooks) {
  hooks.beforeEach(function() {
    window.__hasServiceWorkerUpdate__deferred = RSVP.defer();
    window.hasServiceWorkerUpdate = window.__hasServiceWorkerUpdate__deferred.promise;
  });

  hooks.afterEach(function() {
    delete window.hasServiceWorkerUpdate;
    delete window.__hasServiceWorkerUpdate__deferred;
  });
}

export async function serviceWorkerUpdate() {
  window.__hasServiceWorkerUpdate__deferred &&
  window.__hasServiceWorkerUpdate__deferred.resolve &&
  window.__hasServiceWorkerUpdate__deferred.resolve(true)

  return await settled();
}
