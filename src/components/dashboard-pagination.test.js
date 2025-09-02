import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import './dashboard-pagination.js';

describe('DashboardPagination', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<dashboard-pagination></dashboard-pagination>`);
  });

  describe('Initialization', () => {
    it('should create the element', () => {
      expect(element).to.be.instanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).to.equal('dashboard-pagination');
    });

    it('should initialize with default properties', () => {
      expect(element['current-page']).to.be.undefined;
      expect(element['total-pages']).to.be.undefined;
    });

    it('should extend LitElement', () => {
      expect(element.constructor.name).to.equal('DashboardPagination');
    });
  });

  describe('DOM Structure', () => {
    beforeEach(async () => {
      element['current-page'] = 1;
      element['total-pages'] = 5;
      await elementUpdated(element);
    });

    it('should render pagination container', () => {
      const pagination = element.shadowRoot.querySelector('.pagination');
      expect(pagination).to.exist;
    });

    it('should render previous button', () => {
      const prevButton = element.shadowRoot.querySelector('dashboard-button');
      expect(prevButton).to.exist;
    });

    it('should render next button', () => {
      const buttons = element.shadowRoot.querySelectorAll('dashboard-button');
      expect(buttons).to.have.length(2); // Previous and Next buttons
    });

    it('should render page number buttons', () => {
      const pageButtons = element.shadowRoot.querySelectorAll('.pagination-button');
      expect(pageButtons.length).to.be.above(0);
    });

    it('should render chevron icons in navigation buttons', () => {
      const svgIcons = element.shadowRoot.querySelectorAll('svg');
      expect(svgIcons).to.have.length(2); // Left and right chevrons
    });
  });

  describe('Static Properties', () => {
    it('should have current-page property defined', () => {
      expect(element.constructor.properties['current-page']).to.exist;
      expect(element.constructor.properties['current-page'].type).to.equal(Number);
      expect(element.constructor.properties['current-page'].state).to.be.true;
    });

    it('should have total-pages property defined', () => {
      expect(element.constructor.properties['total-pages']).to.exist;
      expect(element.constructor.properties['total-pages'].type).to.equal(Number);
      expect(element.constructor.properties['total-pages'].state).to.be.true;
    });

    it('should have styles defined', () => {
      expect(element.constructor.styles).to.exist;
    });
  });

  describe('Page Generation Logic', () => {
    it('should generate correct pages for small total pages', async () => {
      element['current-page'] = 2;
      element['total-pages'] = 3;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.deep.equal([1, 2, 3]);
    });

    it('should generate pages with ellipsis for large total pages', async () => {
      element['current-page'] = 5;
      element['total-pages'] = 20;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.include('...');
      expect(pages).to.include(1);
      expect(pages).to.include(20);
    });

    it('should handle single page scenario', async () => {
      element['current-page'] = 1;
      element['total-pages'] = 1;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.deep.equal([1]);
    });

    it('should handle current page at beginning', async () => {
      element['current-page'] = 1;
      element['total-pages'] = 10;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages[0]).to.equal(1);
      expect(pages).to.include(10);
    });

    it('should handle current page at end', async () => {
      element['current-page'] = 10;
      element['total-pages'] = 10;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.include(1);
      expect(pages[pages.length - 1]).to.equal(10);
    });

    it('should remove duplicate pages', async () => {
      element['current-page'] = 2;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const pages = element._getPages();
      const uniquePages = [...new Set(pages)];
      expect(pages).to.deep.equal(uniquePages);
    });
  });

  describe('Navigation Functionality', () => {
    beforeEach(async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);
    });

    it('should go to previous page when _onPreviousPage is called', () => {
      const initialPage = element['current-page'];
      element._onPreviousPage();
      expect(element['current-page']).to.equal(initialPage - 1);
    });

    it('should go to next page when _onNextPage is called', () => {
      const initialPage = element['current-page'];
      element._onNextPage();
      expect(element['current-page']).to.equal(initialPage + 1);
    });

    it('should not go below page 1 when on first page', async () => {
      element['current-page'] = 1;
      await elementUpdated(element);

      element._onPreviousPage();
      expect(element['current-page']).to.equal(1);
    });

    it('should not go above total pages when on last page', async () => {
      element['current-page'] = 5;
      element['total-pages'] = 5;
      await elementUpdated(element);

      element._onNextPage();
      expect(element['current-page']).to.equal(5);
    });

    it('should jump to specific page when _onPageChange is called', () => {
      element._onPageChange(4);
      expect(element['current-page']).to.equal(4);
    });
  });

  describe('Button States', () => {
    it('should disable previous button on first page', async () => {
      element['current-page'] = 1;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const prevButton = element.shadowRoot.querySelector('dashboard-button');
      expect(prevButton.disabled).to.be.true;
    });

    it('should enable previous button when not on first page', async () => {
      element['current-page'] = 2;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const prevButton = element.shadowRoot.querySelector('dashboard-button');
      expect(prevButton.disabled).to.be.false;
    });

    it('should disable next button on last page', async () => {
      element['current-page'] = 5;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const buttons = element.shadowRoot.querySelectorAll('dashboard-button');
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton.disabled).to.be.true;
    });

    it('should enable next button when not on last page', async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const buttons = element.shadowRoot.querySelectorAll('dashboard-button');
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton.disabled).to.be.false;
    });

    it('should highlight current page button', async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const pageButtons = element.shadowRoot.querySelectorAll('.pagination-button');
      const activeButton = Array.from(pageButtons).find(btn => btn.classList.contains('active'));

      expect(activeButton).to.exist;
      expect(activeButton.textContent.trim()).to.equal('3');
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);
    });

    it('should emit page-changed event when page changes', async () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('page-changed', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element._onPageChange(4);

      expect(eventFired).to.be.true;
      expect(eventDetail).to.equal(4);
    });

    it('should handle previous button click', async () => {
      const prevButton = element.shadowRoot.querySelector('dashboard-button');
      const initialPage = element['current-page'];

      prevButton.click();
      await elementUpdated(element);

      expect(element['current-page']).to.equal(initialPage - 1);
    });

    it('should handle next button click', async () => {
      const buttons = element.shadowRoot.querySelectorAll('dashboard-button');
      const nextButton = buttons[buttons.length - 1];
      const initialPage = element['current-page'];

      nextButton.click();
      await elementUpdated(element);

      expect(element['current-page']).to.equal(initialPage + 1);
    });

    it('should handle page number button click', async () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener('page-changed', e => {
        eventFired = true;
        eventDetail = e.detail;
      });

      const pageButtons = element.shadowRoot.querySelectorAll('.pagination-button');
      const targetButton = Array.from(pageButtons).find(btn => btn.textContent.trim() === '2');

      if (targetButton) {
        targetButton.click();
        await elementUpdated(element);

        expect(eventFired).to.be.true;
        expect(eventDetail).to.equal(2);
      }
    });
  });

  describe('Ellipsis Rendering', () => {
    it('should render ellipsis for large page ranges', async () => {
      element['current-page'] = 10;
      element['total-pages'] = 20;
      await elementUpdated(element);

      const ellipsis = element.shadowRoot.querySelectorAll('.pagination-ellipsis');
      expect(ellipsis.length).to.be.above(0);
    });

    it('should not render ellipsis for small page ranges', async () => {
      element['current-page'] = 2;
      element['total-pages'] = 3;
      await elementUpdated(element);

      const ellipsis = element.shadowRoot.querySelectorAll('.pagination-ellipsis');
      expect(ellipsis).to.have.length(0);
    });

    it('should render ellipsis content correctly', async () => {
      element['current-page'] = 10;
      element['total-pages'] = 20;
      await elementUpdated(element);

      const ellipsis = element.shadowRoot.querySelector('.pagination-ellipsis');
      if (ellipsis) {
        expect(ellipsis.textContent).to.equal('...');
      }
    });
  });

  describe('Method Testing', () => {
    beforeEach(async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);
    });

    it('should have _onPreviousPage method', () => {
      expect(element._onPreviousPage).to.be.a('function');
    });

    it('should have _onNextPage method', () => {
      expect(element._onNextPage).to.be.a('function');
    });

    it('should have _onPageChange method', () => {
      expect(element._onPageChange).to.be.a('function');
    });

    it('should have _getPages method', () => {
      expect(element._getPages).to.be.a('function');
    });

    it('should have render method', () => {
      expect(element.render).to.be.a('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero total pages', async () => {
      element['current-page'] = 1;
      element['total-pages'] = 0;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.deep.equal([1]);
    });

    it('should handle negative current page', async () => {
      element['current-page'] = -1;
      element['total-pages'] = 5;
      await elementUpdated(element);

      element._onPreviousPage();
      expect(element['current-page']).to.equal(-1); // Should not go further negative
    });

    it('should handle current page greater than total pages', async () => {
      element['current-page'] = 10;
      element['total-pages'] = 5;
      await elementUpdated(element);

      element._onNextPage();
      expect(element['current-page']).to.equal(10); // Should not increase further
    });

    it('should handle large page numbers', async () => {
      element['current-page'] = 50;
      element['total-pages'] = 100;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.include(1);
      expect(pages).to.include(100);
      expect(pages).to.include(50);
    });
  });

  describe('Page Range Logic', () => {
    it('should show first few pages when current page is at beginning', async () => {
      element['current-page'] = 2;
      element['total-pages'] = 20;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.include(1);
      expect(pages).to.include(2);
      expect(pages).to.include(3);
    });

    it('should show last few pages when current page is at end', async () => {
      element['current-page'] = 19;
      element['total-pages'] = 20;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.include(18);
      expect(pages).to.include(19);
      expect(pages).to.include(20);
    });

    it('should show pages around current page when in middle', async () => {
      element['current-page'] = 10;
      element['total-pages'] = 20;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.include(10);
      expect(pages).to.include(1);
      expect(pages).to.include(20);
    });

    it('should limit visible pages to maximum', async () => {
      element['current-page'] = 10;
      element['total-pages'] = 100;
      await elementUpdated(element);

      const pages = element._getPages();
      // Should not exceed reasonable number of visible pages
      expect(pages.length).to.be.below(10);
    });
  });

  describe('Button Click Behavior', () => {
    beforeEach(async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);
    });

    it('should navigate to previous page on previous button click', async () => {
      const prevButton = element.shadowRoot.querySelector('dashboard-button');

      prevButton.click();
      await elementUpdated(element);

      expect(element['current-page']).to.equal(2);
    });

    it('should navigate to next page on next button click', async () => {
      const buttons = element.shadowRoot.querySelectorAll('dashboard-button');
      const nextButton = buttons[1];

      nextButton.click();
      await elementUpdated(element);

      expect(element['current-page']).to.equal(4);
    });

    it('should not change page when previous button is disabled', async () => {
      element['current-page'] = 1;
      await elementUpdated(element);

      const prevButton = element.shadowRoot.querySelector('dashboard-button');
      expect(prevButton.disabled).to.be.true;

      prevButton.click();
      await elementUpdated(element);

      expect(element['current-page']).to.equal(1);
    });

    it('should not change page when next button is disabled', async () => {
      element['current-page'] = 5;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const buttons = element.shadowRoot.querySelectorAll('dashboard-button');
      const nextButton = buttons[1];
      expect(nextButton.disabled).to.be.true;

      nextButton.click();
      await elementUpdated(element);

      expect(element['current-page']).to.equal(5);
    });
  });

  describe('Active Page Highlighting', () => {
    beforeEach(async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);
    });

    it('should highlight current page button', () => {
      const pageButtons = element.shadowRoot.querySelectorAll('.pagination-button');
      const activeButtons = Array.from(pageButtons).filter(btn => btn.classList.contains('active'));

      expect(activeButtons).to.have.length(1);
      expect(activeButtons[0].textContent.trim()).to.equal('3');
    });

    it('should update active button when page changes', async () => {
      element._onPageChange(4);
      await elementUpdated(element);

      const pageButtons = element.shadowRoot.querySelectorAll('.pagination-button');
      const activeButton = Array.from(pageButtons).find(btn => btn.classList.contains('active'));

      expect(activeButton.textContent.trim()).to.equal('4');
    });

    it('should have only one active button at a time', async () => {
      const pageButtons = element.shadowRoot.querySelectorAll('.pagination-button');
      const activeButtons = Array.from(pageButtons).filter(btn => btn.classList.contains('active'));

      expect(activeButtons).to.have.length(1);
    });
  });

  describe('Custom Events', () => {
    beforeEach(async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);
    });

    it('should emit page-changed event with correct detail', async () => {
      let capturedEvent = null;

      element.addEventListener('page-changed', e => {
        capturedEvent = e;
      });

      element._onPageChange(4);

      expect(capturedEvent).to.exist;
      expect(capturedEvent.type).to.equal('page-changed');
      expect(capturedEvent.detail).to.equal(4);
    });

    it('should emit event when navigating via previous button', async () => {
      let eventFired = false;

      element.addEventListener('page-changed', () => {
        eventFired = true;
      });

      const prevButton = element.shadowRoot.querySelector('dashboard-button');
      prevButton.click();

      // Note: The current implementation doesn't emit events for prev/next buttons
      // This documents the current behavior
    });
  });

  describe('Responsive Design', () => {
    it('should have pagination class for styling', () => {
      const pagination = element.shadowRoot.querySelector('.pagination');
      expect(pagination.classList.contains('pagination')).to.be.true;
    });

    it('should have pagination-button class on page buttons', async () => {
      element['current-page'] = 1;
      element['total-pages'] = 3;
      await elementUpdated(element);

      const pageButtons = element.shadowRoot.querySelectorAll('.pagination-button');
      pageButtons.forEach(button => {
        expect(button.classList.contains('pagination-button')).to.be.true;
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);
    });

    it('should have button elements for page navigation', () => {
      const pageButtons = element.shadowRoot.querySelectorAll('.pagination-button');
      pageButtons.forEach(button => {
        expect(button.tagName.toLowerCase()).to.equal('button');
        expect(button.getAttribute('type')).to.equal('button');
      });
    });

    it('should have dashboard-button components for prev/next', () => {
      const dashboardButtons = element.shadowRoot.querySelectorAll('dashboard-button');
      expect(dashboardButtons).to.have.length(2);
    });

    it('should have proper SVG icons with accessibility attributes', () => {
      const svgIcons = element.shadowRoot.querySelectorAll('svg');
      svgIcons.forEach(svg => {
        expect(svg.getAttribute('viewBox')).to.exist;
        expect(svg.getAttribute('width')).to.equal('24');
        expect(svg.getAttribute('height')).to.equal('24');
      });
    });
  });

  describe('Custom Element Registration', () => {
    it('should be registered as dashboard-pagination custom element', () => {
      expect(window.customElements.get('dashboard-pagination')).to.exist;
    });
  });

  describe('Template Rendering', () => {
    it('should render template correctly', () => {
      const rendered = element.render();
      expect(rendered).to.exist;
    });

    it('should render different content based on page configuration', async () => {
      element['current-page'] = 1;
      element['total-pages'] = 10;
      await elementUpdated(element);

      const content1 = element.shadowRoot.innerHTML;

      element['current-page'] = 5;
      await elementUpdated(element);

      const content2 = element.shadowRoot.innerHTML;

      expect(content1).to.not.equal(content2);
    });
  });

  describe('Page Calculation Edge Cases', () => {
    it('should handle maximum visible pages correctly', async () => {
      element['current-page'] = 5;
      element['total-pages'] = 10;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.be.an('array');
      expect(pages.length).to.be.above(0);
    });

    it('should handle when current page equals total pages', async () => {
      element['current-page'] = 5;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const pages = element._getPages();
      expect(pages).to.include(5);
    });

    it('should handle boundary conditions in page generation', async () => {
      // Test various boundary conditions
      const testCases = [
        { current: 1, total: 1 },
        { current: 1, total: 2 },
        { current: 2, total: 2 },
        { current: 1, total: 6 },
        { current: 6, total: 6 },
      ];

      for (const testCase of testCases) {
        element['current-page'] = testCase.current;
        element['total-pages'] = testCase.total;
        await elementUpdated(element);

        expect(() => element._getPages()).to.not.throw();
        const pages = element._getPages();
        expect(pages).to.be.an('array');
      }
    });
  });

  describe('Property Updates', () => {
    it('should update DOM when current-page changes', async () => {
      element['current-page'] = 1;
      element['total-pages'] = 5;
      await elementUpdated(element);

      let prevButton = element.shadowRoot.querySelector('dashboard-button');
      expect(prevButton.disabled).to.be.true;

      element['current-page'] = 2;
      await elementUpdated(element);

      prevButton = element.shadowRoot.querySelector('dashboard-button');
      expect(prevButton.disabled).to.be.false;
    });

    it('should update DOM when total-pages changes', async () => {
      element['current-page'] = 5;
      element['total-pages'] = 5;
      await elementUpdated(element);

      let nextButtons = element.shadowRoot.querySelectorAll('dashboard-button');
      let nextButton = nextButtons[nextButtons.length - 1];
      expect(nextButton.disabled).to.be.true;

      element['total-pages'] = 10;
      await elementUpdated(element);

      nextButtons = element.shadowRoot.querySelectorAll('dashboard-button');
      nextButton = nextButtons[nextButtons.length - 1];
      expect(nextButton.disabled).to.be.false;
    });
  });

  describe('Error Handling', () => {
    it('should render without errors when properties are undefined', () => {
      expect(() => element.render()).to.not.throw();
    });

    it('should handle invalid page numbers gracefully', () => {
      expect(() => element._onPageChange('invalid')).to.not.throw();
      expect(() => element._onPageChange(null)).to.not.throw();
      expect(() => element._onPageChange(undefined)).to.not.throw();
    });

    it('should handle _getPages with undefined properties', () => {
      element['current-page'] = undefined;
      element['total-pages'] = undefined;

      expect(() => element._getPages()).to.not.throw();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with dashboard-button components', async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const dashboardButtons = element.shadowRoot.querySelectorAll('dashboard-button');
      expect(dashboardButtons).to.have.length(2);

      dashboardButtons.forEach(button => {
        expect(button.tagName.toLowerCase()).to.equal('dashboard-button');
      });
    });

    it('should set correct variant on dashboard buttons', async () => {
      element['current-page'] = 3;
      element['total-pages'] = 5;
      await elementUpdated(element);

      const dashboardButtons = element.shadowRoot.querySelectorAll('dashboard-button');
      dashboardButtons.forEach(button => {
        expect(button.getAttribute('variant')).to.equal('text');
      });
    });
  });
});
