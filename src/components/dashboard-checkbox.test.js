import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { DashboardCheckbox } from './dashboard-checkbox.js';

// Make sure the component is registered
if (!customElements.get('dashboard-checkbox')) {
  customElements.define('dashboard-checkbox', DashboardCheckbox);
}

describe('DashboardCheckbox', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<dashboard-checkbox></dashboard-checkbox>`);
  });

  it('should render correctly', () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal('dashboard-checkbox');
  });

  it('should have default properties', () => {
    expect(element.checked).to.be.false;
    expect(element.disabled).to.be.false;
  });

  it('should render checkbox input and checkmark', () => {
    const input = element.shadowRoot.querySelector('input[type="checkbox"]');
    const checkmark = element.shadowRoot.querySelector('.checkmark');

    expect(input).to.exist;
    expect(checkmark).to.exist;
  });

  it('should reflect checked property to attribute', async () => {
    element.checked = true;
    await element.updateComplete;

    expect(element.hasAttribute('checked')).to.be.true;

    element.checked = false;
    await element.updateComplete;

    expect(element.hasAttribute('checked')).to.be.false;
  });

  it('should update input checked state when property changes', async () => {
    const input = element.shadowRoot.querySelector('input[type="checkbox"]');

    element.checked = true;
    await element.updateComplete;

    expect(input.checked).to.be.true;

    element.checked = false;
    await element.updateComplete;

    expect(input.checked).to.be.false;
  });

  it('should disable input when disabled property is true', async () => {
    const input = element.shadowRoot.querySelector('input[type="checkbox"]');

    element.disabled = true;
    await element.updateComplete;

    expect(input.disabled).to.be.true;

    element.disabled = false;
    await element.updateComplete;

    expect(input.disabled).to.be.false;
  });

  it('should dispatch checked-changed event when checkbox is clicked', async () => {
    const input = element.shadowRoot.querySelector('input[type="checkbox"]');

    const listener = oneEvent(element, 'checked-changed');

    input.click();

    const event = await listener;
    expect(event).to.exist;
    expect(element.checked).to.be.true;
  });

  it('should update checked property when input change event fires', async () => {
    const input = element.shadowRoot.querySelector('input[type="checkbox"]');

    expect(element.checked).to.be.false;

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(element.checked).to.be.true;
  });

  it('should not dispatch event when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    const input = element.shadowRoot.querySelector('input[type="checkbox"]');

    let eventFired = false;
    element.addEventListener('checked-changed', () => {
      eventFired = true;
    });

    // Try to click - should not work when disabled
    input.click();

    // Give it a moment to potentially fire
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(eventFired).to.be.false;
    expect(element.checked).to.be.false;
  });

  it('should have correct CSS classes applied', () => {
    const container = element.shadowRoot.querySelector('.checkbox-container');
    const checkmark = element.shadowRoot.querySelector('.checkmark');

    expect(container).to.exist;
    expect(checkmark).to.exist;
  });

  it('should initialize with constructor values', async () => {
    const newElement = new DashboardCheckbox();

    expect(newElement.checked).to.be.false;
    expect(newElement.disabled).to.be.false;
  });

  it('should handle multiple state changes correctly', async () => {
    // Initial state
    expect(element.checked).to.be.false;
    expect(element.disabled).to.be.false;

    // Enable checked state
    element.checked = true;
    await element.updateComplete;
    expect(element.checked).to.be.true;

    // Disable component
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).to.be.true;
    expect(element.checked).to.be.true; // Should remain checked

    // Re-enable component
    element.disabled = false;
    await element.updateComplete;
    expect(element.disabled).to.be.false;
    expect(element.checked).to.be.true; // Should still be checked
  });

  it('should maintain checked state when toggled multiple times', async () => {
    const input = element.shadowRoot.querySelector('input[type="checkbox"]');

    // Click to check
    input.click();
    expect(element.checked).to.be.true;

    // Click to uncheck
    input.click();
    expect(element.checked).to.be.false;

    // Click to check again
    input.click();
    expect(element.checked).to.be.true;
  });

  describe('Accessibility', () => {
    it('should have proper label structure for screen readers', () => {
      const label = element.shadowRoot.querySelector('label');
      const input = element.shadowRoot.querySelector('input[type="checkbox"]');

      expect(label).to.exist;
      expect(input).to.exist;
      expect(label.contains(input)).to.be.true;
    });

    it('should be keyboard accessible', async () => {
      const input = element.shadowRoot.querySelector('input[type="checkbox"]');

      // Focus the input
      input.focus();
      expect(element.shadowRoot.activeElement).to.equal(input);

      // Simulate space key press (should toggle checkbox)
      const spaceEvent = new KeyboardEvent('keydown', { code: 'Space', key: ' ' });
      input.dispatchEvent(spaceEvent);

      // Note: Space key behavior is handled by the browser for checkbox inputs
      // The test verifies the input can receive focus
    });
  });

  describe('Custom Properties', () => {
    it('should allow setting checked via attribute', async () => {
      const customElement = await fixture(html`<dashboard-checkbox checked></dashboard-checkbox>`);

      expect(customElement.checked).to.be.true;
    });

    it('should allow setting disabled via attribute', async () => {
      const customElement = await fixture(html`<dashboard-checkbox disabled></dashboard-checkbox>`);

      expect(customElement.disabled).to.be.true;

      const input = customElement.shadowRoot.querySelector('input[type="checkbox"]');
      expect(input.disabled).to.be.true;
    });

    it('should allow setting both properties via attributes', async () => {
      const customElement = await fixture(
        html`<dashboard-checkbox checked disabled></dashboard-checkbox>`
      );

      expect(customElement.checked).to.be.true;
      expect(customElement.disabled).to.be.true;
    });
  });
});
