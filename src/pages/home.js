import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import '../components/dashboard-layout';
import '../components/dashboard-table';
import '../components/dashboard-grid';
import '../components/dashboard-button';
import '../components/dashboard-pagination';
import '../components/dashboard-modal';
import store from '../store';
import dayjs from 'dayjs';

const listIconUrl = new URL('../assets/icons/list.svg', import.meta.url).href;
const gridIconUrl = new URL('../assets/icons/grid.svg', import.meta.url).href;

export class Home extends LitElement {
  static properties = {
    employeeData: { type: Array, state: true },
    employeeColumns: { type: Array, state: true },
    _currentPage: { type: Number, state: true },
    _limit: { type: Number, state: true },
    _totalCount: { type: Number, state: true },
    _gridType: { type: String, state: true },
    _selectedItemsCount: { type: Number, state: true },
  };

  static styles = css`
    .home-header {
      display: flex;
      align-items: center;
      justify-content: end;
      gap: 8px;
      margin-top: -64px;
      margin-bottom: 16px;
    }

    .pagination-container {
      margin-top: 16px;
    }

    .delete-modal {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
    }

    .delete-modal-header {
      padding-top: 5px;
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 12px;
    }

    .delete-modal-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
  `;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this._currentPage = 1;
    this._limit = 10;
    this._gridType = 'table';
    this._selectedItemsCount = 0;

    this._prepareEmployeesData();

    store.subscribe(() => {
      this._selectedItemsCount = store.getState().selectedItems.length;
    });
  }

  _onEdit(item) {
    window.location.href = `/edit/${item.id}`;
  }

  _onDelete(item) {
    this.shadowRoot.querySelector('dashboard-modal').open = true;
    store.getState().setItemToDelete(item);
  }

  _onDeleteApproved() {
    if (store.getState().tempDeletableItem) {
      store.getState().deleteEmployee(store.getState().tempDeletableItem.id);
    }

    this.employeeData = store
      .getState()
      .employees.slice((this._currentPage - 1) * this._limit, this._currentPage * this._limit);

    this.shadowRoot.querySelector('dashboard-modal').open = false;
  }

  _onDeleteSelected() {
    if (store.getState().selectedItems.length === 0) {
      return;
    }

    store.getState().employees.forEach(employee => {
      if (store.getState().selectedItems.some(selectedItem => selectedItem.id === employee.id)) {
        store.getState().deleteEmployee(employee.id);
      }
    });

    store.getState().clearSelectedItems();

    this.employeeData = [...store.getState().employees].slice(
      (this._currentPage - 1) * this._limit,
      this._currentPage * this._limit
    );
  }

  _onRowSelected(event) {
    const { item, checked } = event.detail;

    if (checked) {
      store.getState().addSelectedItem(item);
      return;
    }

    store.getState().removeSelectedItem(item);
  }

  _onToggleSelectAll(event) {
    const checked = event.detail;

    let tempSelectedItems = [];
    if (checked) {
      tempSelectedItems = [...this.employeeData];
    } else {
      tempSelectedItems = [];
    }

    store.getState().setSelectedItems([...tempSelectedItems]);
  }

  _onPageChange(page) {
    this._currentPage = page;

    this.employeeData = store
      .getState()
      .employees.slice((page - 1) * this._limit, page * this._limit);
  }

  _prepareEmployeesData() {
    const employees = store.getState().employees;
    if (employees) {
      try {
        this.employeeData = [...employees.sort((a, b) => a.id - b.id)];
        this._totalCount = Math.ceil(this.employeeData.length / this._limit);
        this.employeeData = this.employeeData.slice(
          (this._currentPage - 1) * this._limit,
          this._currentPage * this._limit
        );
      } catch {
        this.employeeData = [];
      }
    }
  }

  willUpdate() {
    this.employeeColumns = [
      { label: msg('First Name'), field: 'first_name' },
      { label: msg('Last Name'), field: 'last_name' },
      {
        label: msg('Date of Employment'),
        field: 'employment_date',
        render: item => {
          return html`${dayjs(item.employment_date).format('MM/DD/YYYY')}`;
        },
      },
      {
        label: msg('Date of Birth'),
        field: 'date_of_birth',
        render: item => {
          return html`${dayjs(item.date_of_birth).format('MM/DD/YYYY')}`;
        },
      },
      { label: msg('Phone'), field: 'phone' },
      { label: msg('Email'), field: 'email' },
      { label: msg('Department'), field: 'department' },
      { label: msg('Position'), field: 'position' },
      {
        label: msg('Actions'),
        field: 'actions',
        hideLabel: true,
        width: '120px',
        render: item => {
          return html`
            <div>
              <dashboard-button
                variant=${this._gridType === 'grid' ? 'secondary' : 'text'}
                size=${this._gridType === 'grid' ? 'small' : 'default'}
                @click=${() => this._onEdit(item)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-square-pen-icon lucide-square-pen"
                >
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path
                    d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                  />
                </svg>
                ${this._gridType === 'grid' ? 'Edit' : null}
              </dashboard-button>
              <dashboard-button
                variant=${this._gridType === 'grid' ? 'default' : 'text'}
                size=${this._gridType === 'grid' ? 'small' : 'default'}
                @click=${() => this._onDelete(item)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-trash-icon lucide-trash"
                >
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                ${this._gridType === 'grid' ? 'Delete' : null}
              </dashboard-button>
            </div>
          `;
        },
      },
    ];
  }

  render() {
    return html`<dashboard-layout title="${msg('Employee List')}">
      <div class="home-header">
        ${this._selectedItemsCount > 0
          ? html`<dashboard-button @click=${this._onDeleteSelected}>
              ${msg('Delete Selecteds')} (${this._selectedItemsCount})
            </dashboard-button>`
          : ''}
        <dashboard-button
          style=${this._gridType === 'table' ? 'opacity: 1;' : 'opacity: 0.5;'}
          variant="text"
          @click=${() => {
            this._gridType = 'table';
          }}
        >
          <img src=${listIconUrl} width="24" />
        </dashboard-button>
        <dashboard-button
          style=${this._gridType === 'grid' ? 'opacity: 1;' : 'opacity: 0.5;'}
          variant="text"
          @click=${() => {
            this._gridType = 'grid';
          }}
        >
          <img src=${gridIconUrl} width="24" />
        </dashboard-button>
      </div>

      ${this._gridType === 'table'
        ? html`<dashboard-table
            .data=${this.employeeData}
            .columns=${this.employeeColumns}
            .selectedItems=${store.getState().selectedItems}
            @row-selected=${this._onRowSelected}
            @toggle-select-all=${this._onToggleSelectAll}
          ></dashboard-table>`
        : html`<dashboard-grid
            .data=${this.employeeData}
            .columns=${this.employeeColumns}
          ></dashboard-grid>`}
      ${this._totalCount > 1
        ? html`
            <div class="pagination-container">
              <dashboard-pagination
                .current-page=${this._currentPage}
                .total-pages=${this._totalCount}
                @page-changed=${e => this._onPageChange(e.detail)}
              ></dashboard-pagination>
            </div>
          `
        : ''}

      <dashboard-modal>
        <div class="delete-modal">
          <div class="delete-modal-header">
            ${msg('Are you sure you want to delete this employee?')}
          </div>
          <p>${msg('This action cannot be undone.')}</p>
          <div class="delete-modal-actions">
            <dashboard-button fullWidth @click=${this._onDeleteApproved}
              >${msg('Delete')}</dashboard-button
            >
            <dashboard-button
              fullWidth
              variant="outlined"
              @click=${() => (this.shadowRoot.querySelector('dashboard-modal').open = false)}
              >${msg('Cancel')}</dashboard-button
            >
          </div>
        </div>
      </dashboard-modal>
    </dashboard-layout>`;
  }
}

window.customElements.define('dashboard-home', Home);
