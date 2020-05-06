'use strict'

const replace = require('broccoli-replace')

module.exports = {
  name: require('./package').name,

  treeForAddon(tree) {
    let rootUrl = this._getRootURL()
    let serviceWorkerFilename = this._getServiceWorkerFilename()
    let isEnabled = this._getServiceWorkerEnabled()

    let replacedTree = replace(tree, {
      files: ['services/service-worker-update-notify.js'],
      patterns: [
        {
          match: /{{ROOT_URL}}/g,
          replacement: rootUrl,
        },
        {
          match: /{{SERVICE_WORKER_FILENAME}}/g,
          replacement: serviceWorkerFilename,
        },
        {
          match: /{{SERVICE_WORKER_ENABLED}}/g,
          replacement: isEnabled ? 'true' : 'false',
        },
      ],
    })

    return this._super(replacedTree)
  },

  _getServiceWorkerEnabled() {
    if (this._swEnabled) {
      return this._swEnabled
    }

    let options = this._getOptions()
    let enabled = options.enabled;
    if (enabled === undefined) {
      // Default is TRUE
      enabled = true;
    }
    return (this._swEnabled = enabled)
  },

  _getRootURL() {
    if (this._projectRootURL) {
      return this._projectRootURL
    }

    let options = this._getOptions()
    let config = this._getConfig()
    let rootURL = options.rootUrl || config.rootURL || config.baseURL || '/'

    return (this._projectRootURL = rootURL)
  },

  _getServiceWorkerFilename() {
    if (this._serviceWorkerFilename) {
      return this._serviceWorkerFilename
    }

    let options = this._getOptions()
    let serviceWorkerFilename = options.serviceWorkerFilename || 'sw.js'
    return (this._serviceWorkerFilename = serviceWorkerFilename)
  },

  _getOptions() {
    return this.app.options['ember-service-worker'] || {}
  },

  _getConfig() {
    return this.project.config(this.app.env)
  },
}
