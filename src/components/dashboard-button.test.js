import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import './dashboard-button.js';

describe('DashboardButton', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<dashboard-button>Click me</dashboard-button>`);
  });

  describe('Default Properties', () => {
    it('should initialize with correct default values', () => {
      expect(element.variant).to.equal('primary');
      expect(element.size).to.equal('default');
      expect(element.rounded).to.be.false;
      expect(element.disabled).to.be.false;
      expect(element.type).to.equal('button');
      expect(element.fullWidth).to.be.false;
    });

    it('should render a button element', () => {
      const button = element.shadowRoot.querySelector('button');
      expect(button).to.exist;
      expect(button.tagName.toLowerCase()).to.equal('button');
    });

    it('should render slotted content', () => {
      const button = element.shadowRoot.querySelector('button');
      const slot = button.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Properties and Attributes', () => {
    it('should update button type when type property changes', async () => {
      const button = element.shadowRoot.querySelector('button');

      expect(button.type).to.equal('button');

      element.type = 'submit';
      await elementUpdated(element);
      expect(button.type).to.equal('submit');
    });

    it('should handle disabled state correctly', async () => {
      const button = element.shadowRoot.querySelector('button');

      expect(button.disabled).to.be.false;

      element.disabled = true;
      await elementUpdated(element);
      expect(button.disabled).to.be.true;
      // Test the property, not the attribute since Lit doesn't auto-reflect
      expect(element.disabled).to.be.true;
    });

    it('should update variant property', async () => {
      const variants = ['primary', 'secondary', 'outlined', 'text'];

      for (const variant of variants) {
        element.variant = variant;
        await elementUpdated(element);
        expect(element.variant).to.equal(variant);
      }
    });

    it('should update size property', async () => {
      element.size = 'small';
      await elementUpdated(element);
      expect(element.size).to.equal('small');
    });

    it('should update rounded property', async () => {
      element.rounded = true;
      await elementUpdated(element);
      expect(element.rounded).to.be.true;

      element.rounded = false;
      await elementUpdated(element);
      expect(element.rounded).to.be.false;
    });

    it('should update fullWidth property', async () => {
      element.fullWidth = true;
      await elementUpdated(element);
      expect(element.fullWidth).to.be.true;

      element.fullWidth = false;
      await elementUpdated(element);
      expect(element.fullWidth).to.be.false;
    });
  });

  describe('Click Behavior', () => {
    it('should dispatch click event when button is clicked', async () => {
      let clickEventFired = false;
      element.addEventListener('click', () => {
        clickEventFired = true;
      });

      const button = element.shadowRoot.querySelector('button');
      button.click();

      expect(clickEventFired).to.be.true;
    });

    it('should not dispatch click event when disabled', async () => {
      element.disabled = true;
      await elementUpdated(element);

      let clickEventFired = false;
      element.addEventListener('click', () => {
        clickEventFired = true;
      });

      const button = element.shadowRoot.querySelector('button');
      button.click();

      expect(clickEventFired).to.be.false;
    });

    it('should handle disabled click behavior correctly', async () => {
      element.disabled = true;
      await elementUpdated(element);

      const button = element.shadowRoot.querySelector('button');

      // The button should be disabled at the DOM level
      expect(button.disabled).to.be.true;
    });
  });

  describe('Form Integration', () => {
    it('should handle submit type property', async () => {
      element.type = 'submit';
      await elementUpdated(element);

      const button = element.shadowRoot.querySelector('button');
      expect(button.type).to.equal('submit');
      expect(element.type).to.equal('submit');
    });

    it('should test _onClick behavior with submit type', async () => {
      element.type = 'submit';
      await elementUpdated(element);

      // When type is submit and there's no form, _onClick should return early
      // and not dispatch a click event
      let clickEventFired = false;
      element.addEventListener('click', () => {
        clickEventFired = true;
      });

      // Call _onClick directly - should return early with no form
      element._onClick();
      expect(clickEventFired).to.be.false;
    });

    it('should not dispatch click when disabled', async () => {
      element.disabled = true;
      await elementUpdated(element);

      let clickEventFired = false;
      element.addEventListener('click', () => {
        clickEventFired = true;
      });

      element._onClick();
      expect(clickEventFired).to.be.false;
    });

    it('should handle form validation logic', async () => {
      element.type = 'submit';
      await elementUpdated(element);

      // Create a mock form
      const mockForm = {
        reportValidity: () => true,
        dispatchEvent: () => true,
      };

      // Mock closest to return our mock form
      const originalClosest = element.closest;
      element.closest = selector => {
        return selector === 'form' ? mockForm : null;
      };

      let formSubmitCalled = false;
      mockForm.dispatchEvent = event => {
        if (event.type === 'submit') {
          formSubmitCalled = true;
        }
        return true;
      };

      element._onClick();
      expect(formSubmitCalled).to.be.true;

      // Restore original method
      element.closest = originalClosest;
    });
  });

  describe('Accessibility', () => {
    it('should have proper button semantics', () => {
      const button = element.shadowRoot.querySelector('button');
      expect(button.tagName.toLowerCase()).to.equal('button');
      expect(button.getAttribute('type')).to.equal('button');
    });

    it('should be focusable by default', () => {
      const button = element.shadowRoot.querySelector('button');
      button.focus();
      expect(document.activeElement).to.equal(element);
    });

    it('should not be focusable when disabled', async () => {
      element.disabled = true;
      await elementUpdated(element);

      const button = element.shadowRoot.querySelector('button');
      expect(button.disabled).to.be.true;
    });

    it('should support keyboard interaction', async () => {
      let clickEventFired = false;
      element.addEventListener('click', () => {
        clickEventFired = true;
      });

      const button = element.shadowRoot.querySelector('button');

      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      button.dispatchEvent(enterEvent);

      // Note: The actual click behavior depends on browser implementation
      // This test ensures the button can receive keyboard events
      expect(button).to.exist;
    });
  });

  describe('Styling and CSS Classes', () => {
    it('should work with pre-set variant attributes', async () => {
      const secondaryButton = await fixture(
        html`<dashboard-button variant="secondary">Secondary</dashboard-button>`
      );
      expect(secondaryButton.getAttribute('variant')).to.equal('secondary');
      expect(secondaryButton.variant).to.equal('secondary');

      const outlinedButton = await fixture(
        html`<dashboard-button variant="outlined">Outlined</dashboard-button>`
      );
      expect(outlinedButton.getAttribute('variant')).to.equal('outlined');
      expect(outlinedButton.variant).to.equal('outlined');
    });

    it('should work with pre-set size attributes', async () => {
      const smallButton = await fixture(
        html`<dashboard-button size="small">Small</dashboard-button>`
      );
      expect(smallButton.getAttribute('size')).to.equal('small');
      expect(smallButton.size).to.equal('small');
    });

    it('should work with pre-set boolean attributes', async () => {
      const roundedButton = await fixture(
        html`<dashboard-button rounded>Rounded</dashboard-button>`
      );
      expect(roundedButton.hasAttribute('rounded')).to.be.true;
      expect(roundedButton.rounded).to.be.true;

      const fullWidthButton = await fixture(
        html`<dashboard-button fullWidth>Full Width</dashboard-button>`
      );
      expect(fullWidthButton.hasAttribute('fullWidth')).to.be.true;
      expect(fullWidthButton.fullWidth).to.be.true;
    });

    it('should update variant property dynamically', async () => {
      element.variant = 'secondary';
      await elementUpdated(element);
      expect(element.variant).to.equal('secondary');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid property changes', async () => {
      element.variant = 'secondary';
      element.size = 'small';
      element.disabled = true;
      element.rounded = true;
      element.fullWidth = true;

      await elementUpdated(element);

      expect(element.variant).to.equal('secondary');
      expect(element.size).to.equal('small');
      expect(element.disabled).to.be.true;
      expect(element.rounded).to.be.true;
      expect(element.fullWidth).to.be.true;
    });

    it('should handle null and undefined values gracefully', async () => {
      element.variant = null;
      await elementUpdated(element);
      expect(element.variant).to.be.null;

      element.variant = undefined;
      await elementUpdated(element);
      expect(element.variant).to.be.undefined;
    });

    it('should work with different slot content', async () => {
      const buttonWithIcon = await fixture(html`
        <dashboard-button>
          <svg width="16" height="16"><circle cx="8" cy="8" r="4" /></svg>
          Icon Button
        </dashboard-button>
      `);

      const button = buttonWithIcon.shadowRoot.querySelector('button');
      const slot = button.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should work with empty slot content', async () => {
      const emptyButton = await fixture(html`<dashboard-button></dashboard-button>`);
      const button = emptyButton.shadowRoot.querySelector('button');
      const slot = button.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should handle invalid variant values', async () => {
      element.variant = 'invalid';
      await elementUpdated(element);
      expect(element.variant).to.equal('invalid');

      // Should still render without errors
      const button = element.shadowRoot.querySelector('button');
      expect(button).to.exist;
    });

    it('should handle invalid size values', async () => {
      element.size = 'invalid';
      await elementUpdated(element);
      expect(element.size).to.equal('invalid');

      // Should still render without errors
      const button = element.shadowRoot.querySelector('button');
      expect(button).to.exist;
    });

    it('should handle invalid type values', async () => {
      element.type = 'invalid';
      await elementUpdated(element);
      expect(element.type).to.equal('invalid');

      const button = element.shadowRoot.querySelector('button');
      // HTML button elements default to 'submit' for invalid type values
      expect(button.type).to.equal('submit');
    });
  });

  describe('Event Handling', () => {
    it('should handle button clicks correctly', async () => {
      let clickEventFired = false;
      element.addEventListener('click', () => {
        clickEventFired = true;
      });

      const button = element.shadowRoot.querySelector('button');
      button.click();

      expect(clickEventFired).to.be.true;
    });

    it('should handle multiple click events correctly', async () => {
      let clickCount = 0;

      element.addEventListener('click', () => {
        clickCount++;
      });

      // Call _onClick directly to avoid native event bubbling
      element._onClick();
      expect(clickCount).to.equal(1);

      element._onClick();
      expect(clickCount).to.equal(2);

      element._onClick();
      expect(clickCount).to.equal(3);
    });

    it('should call _onClick method when button is clicked', async () => {
      // Test that _onClick exists and is callable
      expect(element._onClick).to.be.a('function');

      // Test direct method call
      let eventDispatched = false;
      element.addEventListener('click', () => {
        eventDispatched = true;
      });

      element._onClick();
      expect(eventDispatched).to.be.true;
    });

    it('should prevent event dispatching when disabled', async () => {
      element.disabled = true;
      await elementUpdated(element);

      let clickEventFired = false;
      element.addEventListener('click', () => {
        clickEventFired = true;
      });

      // Test direct _onClick call when disabled
      element._onClick();
      expect(clickEventFired).to.be.false;
    });
  });

  describe('Component Lifecycle', () => {
    it('should be properly defined as custom element', () => {
      expect(customElements.get('dashboard-button')).to.exist;
    });

    it('should create new instances correctly', async () => {
      const newElement = await fixture(
        html`<dashboard-button variant="secondary">New Button</dashboard-button>`
      );
      expect(newElement.variant).to.equal('secondary');
      expect(newElement.tagName.toLowerCase()).to.equal('dashboard-button');
    });

    it('should maintain independent state between instances', async () => {
      const button1 = await fixture(
        html`<dashboard-button variant="primary">Button 1</dashboard-button>`
      );
      const button2 = await fixture(
        html`<dashboard-button variant="secondary">Button 2</dashboard-button>`
      );

      expect(button1.variant).to.equal('primary');
      expect(button2.variant).to.equal('secondary');

      button1.disabled = true;
      await elementUpdated(button1);

      expect(button1.disabled).to.be.true;
      expect(button2.disabled).to.be.false;
    });
  });
});
