import Ember from 'ember'
import Service from '@ember/service'
import Evented from '@ember/object/evented'
import { getOwner } from '@ember/application'
import { tracked } from '@glimmer/tracking'
import { task, timeout } from 'ember-concurrency'
import serviceWorkerHasUpdate from '../utils/service-worker-has-update'

const configKey = 'ember-service-worker-update-notify'
const supportsServiceWorker =
  typeof navigator !== 'undefined' && 'serviceWorker' in navigator

async function update() {
  if (!IS_ENABLED) return
  const reg = await navigator.serviceWorker.register(
    '{{ROOT_URL}}{{SERVICE_WORKER_FILENAME}}',
    { scope: '{{ROOT_URL}}' },
  )

  return reg.update()
}

const IS_ENABLED = '{{SERVICE_WORKER_ENABLED}}' === 'true'

export default class ServiceWorkerUpdateNotify extends Service.extend(
  Evented,
) {
  @tracked hasUpdate = false
  pollingInterval = false;

  @task
  *pollingTask() {
    while (true) {
      yield update()

      yield timeout(this.pollingInterval)
    }
  }

  _attachUpdateHandler() {
    serviceWorkerHasUpdate().then((hasUpdate) => {
      this.pollingTask.cancelAll()

      if (hasUpdate) {
        this.hasUpdate = true
        this.trigger('update')
      }
    })
  }

  constructor() {
    super(...arguments)
    if (!IS_ENABLED) return
    this.pollingInterval = this.getPollingInterval()

    if (typeof FastBoot === 'undefined') {
      this._attachUpdateHandler()
      if (!Ember.testing && supportsServiceWorker) {
        this.pollingTask.perform()
      }
    }
  }

  getPollingInterval() {
    let config = getOwner(this).resolveRegistration('config:environment')[
      configKey
    ]
    return (config && config.pollingInterval) || 120000
  }
}
