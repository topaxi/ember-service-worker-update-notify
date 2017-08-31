import RSVP from 'rsvp'

const { resolve } = RSVP

export default function serviceWorkerHasUpdate() {
  return resolve(
    'hasServiceWorkerUpdate' in window ?
      window.hasServiceWorkerUpdate :
      false
  )
}
