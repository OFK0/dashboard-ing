import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import './dashboard-checkbox';

export class DashboardTable extends LitElement {
  static styles = css`
    .table-outer {
      max-width: 100%;
      overflow-x: auto;
      border-radius: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      font-weight: 600;
      color: var(--primary-color);
      font-size: 16px;
    }

    th,
    td {
      padding: 12px 16px;
      background-color: white;
      border-bottom: 1px solid #eee;
      text-align: center;
    }

    td {
      font-size: 16px;
      color: #333;
    }

    .no-data-text {
      font-size: 18px;
      color: #999;
      text-align: center;
      padding: 12px 0;
    }
  `;

  static properties = {
    data: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    selectedItems: { type: Array, state: true },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.data = [];
    this.columns = [];
    this.selectedItems = [];
  }

  _onHeaderCheckboxChange(event) {
    const checked = event.target.checked;

    this.dispatchEvent(new CustomEvent('toggle-select-all', { detail: checked }));
  }

  _onRowCheckboxChange(itemIndex) {
    return event => {
      const checked = event.target.checked;

      this.dispatchEvent(
        new CustomEvent('row-selected', { detail: { item: this.data[itemIndex], checked } })
      );
    };
  }

  render() {
    return html`
      <div class="table-outer">
        <table>
          <thead>
            <tr>
              <th>
                <dashboard-checkbox
                  class="header-checkbox"
                  .disabled=${this.data?.length === 0}
                  .checked=${this.selectedItems?.length === this.data?.length &&
                  this.data?.length > 0}
                  @checked-changed=${this._onHeaderCheckboxChange}
                ></dashboard-checkbox>
              </th>
              ${this.columns && this.columns?.length > 0
                ? this.columns.map(column => html` <th>${column.label}</th> `)
                : ''}
            </tr>
          </thead>
          <tbody>
            ${this.data && this.data?.length > 0
              ? this.data.map(
                  (item, itemIndex) => html`
                    <tr>
                      <td>
                        <dashboard-checkbox
                          .checked=${this.selectedItems.findIndex(
                            selectedItem => selectedItem.id === item.id
                          ) > -1}
                          @checked-changed=${this._onRowCheckboxChange(itemIndex)}
                        ></dashboard-checkbox>
                      </td>
                      ${this.columns && this.columns?.length > 0
                        ? this.columns.map(column => {
                            if (column?.render) {
                              return html` <td width=${column.width}>${column.render(item)}</td> `;
                            }
                            return html` <td width=${column.width}>${item[column.field]}</td> `;
                          })
                        : ''}
                    </tr>
                  `
                )
              : html`
                  <tr>
                    <td colspan=${(this.columns?.length || 0) + 1}>
                      <div class="no-data-text">${msg('No data available')}</div>
                    </td>
                  </tr>
                `}
          </tbody>
        </table>
      </div>
    `;
  }
}

window.customElements.define('dashboard-table', DashboardTable);
