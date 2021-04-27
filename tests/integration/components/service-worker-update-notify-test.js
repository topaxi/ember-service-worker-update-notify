/* eslint-disable ember/no-jquery */
import { module, skip } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module(
  'Integration | Component | service worker update notify',
  function (hooks) {
    setupRenderingTest(hooks)

    skip('it renders', function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      render(hbs`<ServiceWorkerUpdateNotify />`)

      assert.equal(this.$().text().trim(), '')

      // Template block usage:
      render(hbs`
      <ServiceWorkerUpdateNotify>
        template block text
      </ServiceWorkerUpdateNotify>
    `)

      assert.equal(this.$().text().trim(), 'template block text')
    })
  },
)
