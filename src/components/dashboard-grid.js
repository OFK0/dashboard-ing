import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import './dashboard-checkbox';

export class DashboardGrid extends LitElement {
  static styles = css`
    .grid-outer {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .grid-outer {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .grid-el {
      padding: 12px;
      background-color: white;
      border-bottom: 1px solid #eee;
      border-radius: 4px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    @media (min-width: 768px) {
      .grid-el {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .grid-el-column-name {
      font-size: 14px;
      color: #787878;
    }

    .no-data-text {
      font-size: 18px;
      color: #999;
      text-align: left;
      padding: 12px 0;
    }
  `;

  static properties = {
    data: { type: Array },
    columns: { type: Array },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.data = [];
    this.columns = [];
  }

  render() {
    return html`
      <div class="grid-outer">
        ${this.data && this.data?.length > 0
          ? this.data.map(
              item => html`
                <div class="grid-el">
                  ${this.columns
                    ? this.columns.map(column => {
                        return html`
                          <div>
                            ${column.hideLabel
                              ? null
                              : html`<div class="grid-el-column-name">${column.label}</div>`}
                            <div>${column.render ? column.render(item) : item[column.field]}</div>
                          </div>
                        `;
                      })
                    : null}
                </div>
              `
            )
          : html` <div class="no-data-text">${msg('No data available')}</div> `}
      </div>
    `;
  }
}

window.customElements.define('dashboard-grid', DashboardGrid);
