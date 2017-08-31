import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('service-worker-update-notify', 'Integration | Component | service worker update notify', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{service-worker-update-notify}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#service-worker-update-notify}}
      template block text
    {{/service-worker-update-notify}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
