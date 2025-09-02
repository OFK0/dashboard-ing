import { html, fixture, expect } from '@open-wc/testing';
import { DashboardGrid } from './dashboard-grid.js';

describe('DashboardGrid', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<dashboard-grid></dashboard-grid>`);
  });

  describe('Component Registration', () => {
    it('should be registered as custom element', () => {
      expect(customElements.get('dashboard-grid')).to.exist;
    });

    it('should be an instance of DashboardGrid', () => {
      expect(element).to.be.instanceOf(DashboardGrid);
    });
  });

  describe('Default Properties', () => {
    it('should initialize with correct default values', () => {
      expect(element.data).to.deep.equal([]);
      expect(element.columns).to.deep.equal([]);
    });

    it('should render grid outer container', () => {
      const gridOuter = element.shadowRoot.querySelector('.grid-outer');
      expect(gridOuter).to.exist;
    });

    it('should have correct property configuration', () => {
      expect(element.constructor.properties.data.type).to.equal(Array);
      expect(element.constructor.properties.columns.type).to.equal(Array);
    });

    it('should have static styles defined', () => {
      expect(element.constructor.styles).to.exist;
    });
  });

  describe('Empty State', () => {
    it('should display no data message when data is empty', () => {
      const noDataText = element.shadowRoot.querySelector('.no-data-text');
      expect(noDataText).to.exist;
      expect(noDataText.textContent.trim()).to.equal('No data available');
    });

    it('should not render grid elements when data is empty', () => {
      const gridElements = element.shadowRoot.querySelectorAll('.grid-el');
      expect(gridElements).to.have.length(0);
    });
  });

  describe('Data Rendering', () => {
    beforeEach(async () => {
      element.data = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ];
      element.columns = [
        { field: 'name', label: 'Name' },
        { field: 'email', label: 'Email' },
      ];
      await element.updateComplete;
    });

    it('should render grid elements for each data item', () => {
      const gridElements = element.shadowRoot.querySelectorAll('.grid-el');
      expect(gridElements).to.have.length(2);
    });

    it('should render column labels and values', () => {
      const columnNames = element.shadowRoot.querySelectorAll('.grid-el-column-name');
      expect(columnNames).to.have.length(4); // 2 items × 2 columns
      expect(columnNames[0].textContent).to.equal('Name');
      expect(columnNames[1].textContent).to.equal('Email');
    });

    it('should display correct field values', () => {
      const gridElements = element.shadowRoot.querySelectorAll('.grid-el');
      const firstElement = gridElements[0];
      const textContent = firstElement.textContent;
      expect(textContent).to.include('John');
      expect(textContent).to.include('john@example.com');
    });

    it('should hide labels when hideLabel is true', async () => {
      element.columns = [
        { field: 'name', label: 'Name', hideLabel: true },
        { field: 'email', label: 'Email' },
      ];
      await element.updateComplete;

      const columnNames = element.shadowRoot.querySelectorAll('.grid-el-column-name');
      expect(columnNames).to.have.length(2); // Only 1 column per item should show label
    });
  });

  describe('Custom Render Function', () => {
    it('should use custom render function when provided', async () => {
      element.data = [{ status: 'active' }];
      element.columns = [
        {
          field: 'status',
          label: 'Status',
          render: item =>
            html`<span class="status-${item.status}">${item.status.toUpperCase()}</span>`,
        },
      ];
      await element.updateComplete;

      const customElement = element.shadowRoot.querySelector('.status-active');
      expect(customElement).to.exist;
      expect(customElement.textContent).to.equal('ACTIVE');
    });

    it('should fallback to field value when render function is not provided', async () => {
      element.data = [{ name: 'Test User' }];
      element.columns = [{ field: 'name', label: 'Name' }];
      await element.updateComplete;

      const gridElement = element.shadowRoot.querySelector('.grid-el');
      expect(gridElement.textContent).to.include('Test User');
    });
  });

  describe('Property Updates', () => {
    it('should update display when data property changes', async () => {
      // Initially empty
      expect(element.shadowRoot.querySelectorAll('.grid-el')).to.have.length(0);

      // Add data
      element.data = [{ name: 'Test' }];
      element.columns = [{ field: 'name', label: 'Name' }];
      await element.updateComplete;

      expect(element.shadowRoot.querySelectorAll('.grid-el')).to.have.length(1);
    });

    it('should update display when columns property changes', async () => {
      element.data = [{ name: 'Test', email: 'test@example.com' }];
      element.columns = [{ field: 'name', label: 'Name' }];
      await element.updateComplete;

      expect(element.shadowRoot.querySelectorAll('.grid-el-column-name')).to.have.length(1);

      // Add another column
      element.columns = [
        { field: 'name', label: 'Name' },
        { field: 'email', label: 'Email' },
      ];
      await element.updateComplete;

      expect(element.shadowRoot.querySelectorAll('.grid-el-column-name')).to.have.length(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null data gracefully', async () => {
      element.data = null;
      element.columns = [{ field: 'name', label: 'Name' }];
      await element.updateComplete;

      const noDataText = element.shadowRoot.querySelector('.no-data-text');
      expect(noDataText).to.exist;
      expect(noDataText.textContent.trim()).to.equal('No data available');
    });

    it('should handle undefined data gracefully', async () => {
      element.data = undefined;
      element.columns = [{ field: 'name', label: 'Name' }];
      await element.updateComplete;

      const noDataText = element.shadowRoot.querySelector('.no-data-text');
      expect(noDataText).to.exist;
    });

    it('should handle missing field values gracefully', async () => {
      element.data = [{ name: 'John' }]; // Missing email field
      element.columns = [
        { field: 'name', label: 'Name' },
        { field: 'email', label: 'Email' }, // This field doesn't exist in data
      ];
      await element.updateComplete;

      const gridElements = element.shadowRoot.querySelectorAll('.grid-el');
      expect(gridElements).to.have.length(1);

      // Should still render the structure even with missing data
      const columnNames = element.shadowRoot.querySelectorAll('.grid-el-column-name');
      expect(columnNames).to.have.length(2);
    });

    it('should handle both hideLabel and custom render together', async () => {
      element.data = [{ status: 'active' }];
      element.columns = [
        {
          field: 'status',
          label: 'Status',
          hideLabel: true,
          render: item => html`<span class="custom-status">${item.status}</span>`,
        },
      ];
      await element.updateComplete;

      const columnNames = element.shadowRoot.querySelectorAll('.grid-el-column-name');
      expect(columnNames).to.have.length(0); // Label should be hidden

      const customElement = element.shadowRoot.querySelector('.custom-status');
      expect(customElement).to.exist;
      expect(customElement.textContent).to.equal('active');
    });
  });
});
