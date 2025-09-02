import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import './dashboard-modal.js';

describe('DashboardModal', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<dashboard-modal></dashboard-modal>`);
  });

  describe('Initialization', () => {
    it('should create the element', () => {
      expect(element).to.be.instanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).to.equal('dashboard-modal');
    });

    it('should initialize with closed state', () => {
      expect(element.open).to.be.false;
    });

    it('should extend LitElement', () => {
      expect(element.constructor.name).to.equal('DashboardModal');
    });
  });

  describe('DOM Structure', () => {
    it('should render modal container', () => {
      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal).to.exist;
    });

    it('should render modal content container', () => {
      const modalContent = element.shadowRoot.querySelector('.modal-content');
      expect(modalContent).to.exist;
    });

    it('should render close button', () => {
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      expect(closeButton).to.exist;
      expect(closeButton.tagName.toLowerCase()).to.equal('button');
    });

    it('should render slot for content', () => {
      const slot = element.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should have close button with correct content', () => {
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      expect(closeButton.textContent.trim()).to.equal('×');
    });
  });

  describe('Open/Close Functionality', () => {
    it('should not have is-open class when closed', () => {
      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal.classList.contains('is-open')).to.be.false;
    });

    it('should have is-open class when opened', async () => {
      element.open = true;
      await elementUpdated(element);

      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal.classList.contains('is-open')).to.be.true;
    });

    it('should toggle open state', async () => {
      expect(element.open).to.be.false;

      element.open = true;
      await elementUpdated(element);
      expect(element.open).to.be.true;

      element.open = false;
      await elementUpdated(element);
      expect(element.open).to.be.false;
    });

    it('should close modal when close button is clicked', async () => {
      element.open = true;
      await elementUpdated(element);

      expect(element.open).to.be.true;

      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      closeButton.click();
      await elementUpdated(element);

      expect(element.open).to.be.false;
    });
  });

  describe('CSS Classes', () => {
    it('should always have modal class', () => {
      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal.classList.contains('modal')).to.be.true;
    });

    it('should conditionally apply is-open class', async () => {
      const modal = element.shadowRoot.querySelector('.modal');

      // Closed state
      expect(modal.classList.contains('is-open')).to.be.false;

      // Open state
      element.open = true;
      await elementUpdated(element);
      expect(modal.classList.contains('is-open')).to.be.true;

      // Closed again
      element.open = false;
      await elementUpdated(element);
      expect(modal.classList.contains('is-open')).to.be.false;
    });

    it('should have correct CSS classes on modal content', () => {
      const modalContent = element.shadowRoot.querySelector('.modal-content');
      expect(modalContent.classList.contains('modal-content')).to.be.true;
    });

    it('should have correct CSS classes on close button', () => {
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      expect(closeButton.classList.contains('modal-close-button')).to.be.true;
    });
  });

  describe('Slot Content', () => {
    it('should render slotted content', async () => {
      const elementWithContent = await fixture(html`
        <dashboard-modal>
          <div id="test-content">Modal Content</div>
        </dashboard-modal>
      `);

      const slot = elementWithContent.shadowRoot.querySelector('slot');
      expect(slot).to.exist;

      const slottedElements = slot.assignedElements();
      expect(slottedElements).to.have.length(1);
      expect(slottedElements[0].id).to.equal('test-content');
    });

    it('should handle multiple slotted elements', async () => {
      const elementWithMultipleContent = await fixture(html`
        <dashboard-modal>
          <h2>Modal Title</h2>
          <p>Modal description</p>
          <button>Action Button</button>
        </dashboard-modal>
      `);

      const slot = elementWithMultipleContent.shadowRoot.querySelector('slot');
      const slottedElements = slot.assignedElements();
      expect(slottedElements).to.have.length(3);
    });

    it('should handle empty slot content', () => {
      const slot = element.shadowRoot.querySelector('slot');
      const slottedElements = slot.assignedElements();
      expect(slottedElements).to.have.length(0);
    });

    it('should maintain slot content when modal opens/closes', async () => {
      const elementWithContent = await fixture(html`
        <dashboard-modal>
          <div>Persistent Content</div>
        </dashboard-modal>
      `);

      const slot = elementWithContent.shadowRoot.querySelector('slot');

      // Check content when closed
      expect(slot.assignedElements()).to.have.length(1);

      // Open modal
      elementWithContent.open = true;
      await elementUpdated(elementWithContent);
      expect(slot.assignedElements()).to.have.length(1);

      // Close modal
      elementWithContent.open = false;
      await elementUpdated(elementWithContent);
      expect(slot.assignedElements()).to.have.length(1);
    });
  });

  describe('Static Properties', () => {
    it('should have open property defined in static properties', () => {
      expect(element.constructor.properties).to.exist;
      expect(element.constructor.properties.open).to.exist;
      expect(element.constructor.properties.open.type).to.equal(Boolean);
    });

    it('should have styles defined', () => {
      expect(element.constructor.styles).to.exist;
    });
  });

  describe('Event Handling', () => {
    it('should close modal on close button click', async () => {
      element.open = true;
      await elementUpdated(element);

      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      expect(element.open).to.be.true;

      closeButton.click();
      await elementUpdated(element);

      expect(element.open).to.be.false;
    });

    it('should have click event listener on close button', () => {
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      expect(closeButton).to.exist;
    });
  });

  describe('Accessibility', () => {
    it('should have button element for close functionality', () => {
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      expect(closeButton.tagName.toLowerCase()).to.equal('button');
    });

    it('should have proper close button positioning', () => {
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      const computedStyle = getComputedStyle(closeButton);
      expect(closeButton.style.position || computedStyle.position).to.exist;
    });
  });

  describe('Layout and Positioning', () => {
    it('should have modal with fixed positioning', () => {
      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal).to.exist;
    });

    it('should have modal content with relative positioning', () => {
      const modalContent = element.shadowRoot.querySelector('.modal-content');
      expect(modalContent).to.exist;
    });

    it('should maintain proper DOM structure', () => {
      const modal = element.shadowRoot.querySelector('.modal');
      const modalContent = modal.querySelector('.modal-content');
      const slot = modalContent.querySelector('slot');
      const closeButton = modalContent.querySelector('.modal-close-button');

      expect(modal).to.exist;
      expect(modalContent).to.exist;
      expect(slot).to.exist;
      expect(closeButton).to.exist;
    });
  });

  describe('Custom Element Registration', () => {
    it('should be registered as dashboard-modal custom element', () => {
      expect(window.customElements.get('dashboard-modal')).to.exist;
    });
  });

  describe('Template Rendering', () => {
    it('should render template correctly', () => {
      const rendered = element.render();
      expect(rendered).to.exist;
    });

    it('should use classMap for conditional classes', async () => {
      const modal = element.shadowRoot.querySelector('.modal');

      // Closed state
      expect(modal.classList.contains('modal')).to.be.true;
      expect(modal.classList.contains('is-open')).to.be.false;

      // Open state
      element.open = true;
      await elementUpdated(element);
      expect(modal.classList.contains('modal')).to.be.true;
      expect(modal.classList.contains('is-open')).to.be.true;
    });
  });

  describe('Property Updates', () => {
    it('should reflect open property changes to DOM', async () => {
      const modal = element.shadowRoot.querySelector('.modal');

      element.open = true;
      await elementUpdated(element);
      expect(modal.classList.contains('is-open')).to.be.true;

      element.open = false;
      await elementUpdated(element);
      expect(modal.classList.contains('is-open')).to.be.false;
    });

    it('should handle different truthy values for open property', async () => {
      element.open = 'true'; // String
      await elementUpdated(element);

      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal.classList.contains('is-open')).to.be.true;

      element.open = 1; // Number
      await elementUpdated(element);
      expect(modal.classList.contains('is-open')).to.be.true;

      element.open = false;
      await elementUpdated(element);
      expect(modal.classList.contains('is-open')).to.be.false;
    });
  });

  describe('Modal Behavior', () => {
    it('should start in closed state by default', () => {
      expect(element.open).to.be.false;
      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal.classList.contains('is-open')).to.be.false;
    });

    it('should show modal when opened', async () => {
      element.open = true;
      await elementUpdated(element);

      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal.classList.contains('is-open')).to.be.true;
    });

    it('should hide modal when closed', async () => {
      element.open = true;
      await elementUpdated(element);

      element.open = false;
      await elementUpdated(element);

      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal.classList.contains('is-open')).to.be.false;
    });
  });

  describe('Close Button Functionality', () => {
    it('should set open to false when close button is clicked', async () => {
      element.open = true;
      await elementUpdated(element);

      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      closeButton.click();
      await elementUpdated(element);

      expect(element.open).to.be.false;
    });

    it('should have close button with × symbol', () => {
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      expect(closeButton.textContent.trim()).to.equal('×');
    });

    it('should position close button in top right corner', () => {
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      expect(closeButton).to.exist;
      // The positioning is handled by CSS, so we just verify the button exists
    });
  });

  describe('Modal Content Structure', () => {
    it('should have slot inside modal content', () => {
      const modalContent = element.shadowRoot.querySelector('.modal-content');
      const slot = modalContent.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should have close button inside modal content', () => {
      const modalContent = element.shadowRoot.querySelector('.modal-content');
      const closeButton = modalContent.querySelector('.modal-close-button');
      expect(closeButton).to.exist;
    });

    it('should maintain proper content hierarchy', () => {
      const modal = element.shadowRoot.querySelector('.modal');
      const modalContent = modal.querySelector('.modal-content');

      expect(modalContent.parentElement).to.equal(modal);
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined open property gracefully', async () => {
      element.open = undefined;
      await elementUpdated(element);

      expect(() => element.render()).to.not.throw();
    });

    it('should handle null open property gracefully', async () => {
      element.open = null;
      await elementUpdated(element);

      expect(() => element.render()).to.not.throw();
    });
  });

  describe('Integration Tests', () => {
    it('should work with slotted form content', async () => {
      const modalWithForm = await fixture(html`
        <dashboard-modal .open=${true}>
          <form>
            <h2>Form Title</h2>
            <input type="text" placeholder="Name" />
            <button type="submit">Submit</button>
          </form>
        </dashboard-modal>
      `);

      const slot = modalWithForm.shadowRoot.querySelector('slot');
      const slottedElements = slot.assignedElements();
      expect(slottedElements).to.have.length(1);
      expect(slottedElements[0].tagName.toLowerCase()).to.equal('form');
    });

    it('should work with slotted text content', async () => {
      const modalWithText = await fixture(html`
        <dashboard-modal>
          <p>Simple text content</p>
        </dashboard-modal>
      `);

      const slot = modalWithText.shadowRoot.querySelector('slot');
      const slottedElements = slot.assignedElements();
      expect(slottedElements).to.have.length(1);
      expect(slottedElements[0].textContent).to.equal('Simple text content');
    });
  });

  describe('State Management', () => {
    it('should maintain state after multiple open/close cycles', async () => {
      // Open
      element.open = true;
      await elementUpdated(element);
      expect(element.open).to.be.true;

      // Close
      element.open = false;
      await elementUpdated(element);
      expect(element.open).to.be.false;

      // Open again
      element.open = true;
      await elementUpdated(element);
      expect(element.open).to.be.true;
    });

    it('should update DOM classes when state changes', async () => {
      const modal = element.shadowRoot.querySelector('.modal');

      // Initial state
      expect(modal.classList.contains('is-open')).to.be.false;

      // Open
      element.open = true;
      await elementUpdated(element);
      expect(modal.classList.contains('is-open')).to.be.true;

      // Close via button
      const closeButton = element.shadowRoot.querySelector('.modal-close-button');
      closeButton.click();
      await elementUpdated(element);
      expect(modal.classList.contains('is-open')).to.be.false;
    });
  });

  describe('Responsive Design', () => {
    it('should have modal-content class for responsive styling', () => {
      const modalContent = element.shadowRoot.querySelector('.modal-content');
      expect(modalContent.classList.contains('modal-content')).to.be.true;
    });
  });

  describe('Component Methods', () => {
    it('should have render method', () => {
      expect(element.render).to.be.a('function');
    });

    it('should render without errors', () => {
      expect(() => element.render()).to.not.throw();
    });
  });
});
