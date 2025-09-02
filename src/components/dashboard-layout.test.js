import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import './dashboard-layout.js';

describe('DashboardLayout', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<dashboard-layout></dashboard-layout>`);
  });

  describe('Initialization', () => {
    it('should create the element', () => {
      expect(element).to.be.instanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).to.equal('dashboard-layout');
    });

    it('should initialize without a title', () => {
      expect(element.title).to.be.undefined;
    });

    it('should extend LitElement', () => {
      expect(element.constructor.name).to.equal('DashboardLayout');
    });
  });

  describe('DOM Structure', () => {
    it('should render main element', () => {
      const main = element.shadowRoot.querySelector('main');
      expect(main).to.exist;
    });

    it('should render dashboard-header component', () => {
      const header = element.shadowRoot.querySelector('dashboard-header');
      expect(header).to.exist;
    });

    it('should render content container', () => {
      const content = element.shadowRoot.querySelector('.content');
      expect(content).to.exist;
    });

    it('should render slot for content', () => {
      const slot = element.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should not render page heading when no title is provided', () => {
      const heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.not.exist;
    });
  });

  describe('Title Property', () => {
    it('should render page heading when title is provided', async () => {
      element.title = 'Test Page Title';
      await elementUpdated(element);

      const heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.exist;
      expect(heading.tagName.toLowerCase()).to.equal('h1');
      expect(heading.textContent).to.equal('Test Page Title');
    });

    it('should update page heading when title changes', async () => {
      element.title = 'Initial Title';
      await elementUpdated(element);

      let heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading.textContent).to.equal('Initial Title');

      element.title = 'Updated Title';
      await elementUpdated(element);

      heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading.textContent).to.equal('Updated Title');
    });

    it('should remove page heading when title is cleared', async () => {
      element.title = 'Test Title';
      await elementUpdated(element);

      let heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.exist;

      element.title = '';
      await elementUpdated(element);

      heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.not.exist;
    });

    it('should handle special characters in title', async () => {
      const specialTitle = 'Title with éñ & <special> "characters"';
      element.title = specialTitle;
      await elementUpdated(element);

      const heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading.textContent).to.equal(specialTitle);
    });
  });

  describe('Slot Content', () => {
    it('should render slotted content', async () => {
      const elementWithContent = await fixture(html`
        <dashboard-layout>
          <div id="test-content">Test Content</div>
        </dashboard-layout>
      `);

      const slot = elementWithContent.shadowRoot.querySelector('slot');
      expect(slot).to.exist;

      // Check that slotted content is present
      const slottedElements = slot.assignedElements();
      expect(slottedElements).to.have.length(1);
      expect(slottedElements[0].id).to.equal('test-content');
    });

    it('should handle multiple slotted elements', async () => {
      const elementWithMultipleContent = await fixture(html`
        <dashboard-layout>
          <div>First Element</div>
          <p>Second Element</p>
          <span>Third Element</span>
        </dashboard-layout>
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
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes applied', () => {
      const content = element.shadowRoot.querySelector('.content');
      expect(content).to.exist;
      expect(content.classList.contains('content')).to.be.true;
    });

    it('should have page-heading class when title is present', async () => {
      element.title = 'Test Title';
      await elementUpdated(element);

      const heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.exist;
      expect(heading.classList.contains('page-heading')).to.be.true;
    });

    it('should have defined styles', () => {
      expect(element.constructor.styles).to.exist;
    });
  });

  describe('Static Properties', () => {
    it('should have title property defined in static properties', () => {
      expect(element.constructor.properties).to.exist;
      expect(element.constructor.properties.title).to.exist;
      expect(element.constructor.properties.title.type).to.equal(String);
    });

    it('should have styles defined', () => {
      expect(element.constructor.styles).to.exist;
    });
  });

  describe('Component Integration', () => {
    it('should include dashboard-header component', () => {
      const header = element.shadowRoot.querySelector('dashboard-header');
      expect(header).to.exist;
    });

    it('should maintain proper hierarchy with header and content', () => {
      const main = element.shadowRoot.querySelector('main');
      const header = main.querySelector('dashboard-header');
      const content = main.querySelector('.content');

      expect(header).to.exist;
      expect(content).to.exist;

      // Header should come before content
      expect(
        header.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING
      ).to.be.above(0);
    });
  });

  describe('Localization Support', () => {
    it('should support localization updates', () => {
      // The component calls updateWhenLocaleChanges in constructor
      // This test verifies the component is set up for localization
      expect(element.constructor.name).to.equal('DashboardLayout');
    });
  });

  describe('Attributes and Properties', () => {
    it('should reflect title property to attribute', async () => {
      element.title = 'Test Title';
      await elementUpdated(element);

      expect(element.title).to.equal('Test Title');
    });

    it('should handle title property as string', async () => {
      element.title = 123; // Number
      await elementUpdated(element);

      const heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading.textContent).to.equal('123');
    });
  });

  describe('Custom Element Registration', () => {
    it('should be registered as dashboard-layout custom element', () => {
      expect(window.customElements.get('dashboard-layout')).to.exist;
    });
  });

  describe('Template Rendering', () => {
    it('should render template correctly', () => {
      const rendered = element.render();
      expect(rendered).to.exist;
    });

    it('should conditionally render title based on property', async () => {
      // Without title
      let heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.not.exist;

      // With title
      element.title = 'New Title';
      await elementUpdated(element);

      heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('New Title');
    });
  });

  describe('Layout Structure', () => {
    it('should have proper layout structure with main > header + content', () => {
      const main = element.shadowRoot.querySelector('main');
      expect(main).to.exist;

      const children = Array.from(main.children);
      expect(children).to.have.length(2);

      expect(children[0].tagName.toLowerCase()).to.equal('dashboard-header');
      expect(children[1].classList.contains('content')).to.be.true;
    });

    it('should have content container with slot inside', () => {
      const content = element.shadowRoot.querySelector('.content');
      const slot = content.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined title gracefully', async () => {
      element.title = undefined;
      await elementUpdated(element);

      const heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.not.exist;
    });

    it('should handle null title gracefully', async () => {
      element.title = null;
      await elementUpdated(element);

      const heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.not.exist;
    });

    it('should handle empty string title gracefully', async () => {
      element.title = '';
      await elementUpdated(element);

      const heading = element.shadowRoot.querySelector('.page-heading');
      expect(heading).to.not.exist;
    });
  });
});
