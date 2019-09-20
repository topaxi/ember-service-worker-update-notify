'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    'ember-service-worker-update-notify': {
      pollingInterval:1200000 // 20 min in ms
    }
  };
};
