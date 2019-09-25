import RSVP from 'rsvp';
import { settled } from '@ember/test-helpers';

export function setupServiceWorkerUpdater(hooks) {
  hooks.beforeEach(function() {
    window.hasServiceWorkerUpdate = RSVP.defer();
  });

  hooks.afterEach(function() {
    window.hasServiceWorkerUpdate = undefined;
  });
}

export async function hasServiceWorkerUpdate() {
  window.hasServiceWorkerUpdate &&
  window.hasServiceWorkerUpdate.resolve &&
  window.hasServiceWorkerUpdate.resolve()

  return await settled();
}
