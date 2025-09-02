import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import './dashboard-button';

export class DashboardPagination extends LitElement {
  static properties = {
    'current-page': { type: Number, state: true },
    'total-pages': { type: Number, state: true },
  };

  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
    }

    .pagination-button {
      color: #333;
      font-size: 16px;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-radius: 100%;
      background: none;
      border: none;
      transition: all 0.2s ease;

      &:hover:not(:disabled),
      &.active {
        color: white;
        background-color: var(--primary-color);
      }
    }
  `;

  _onPreviousPage() {
    if (this['current-page'] > 1) {
      this['current-page']--;
    }
  }

  _onNextPage() {
    if (this['current-page'] < this['total-pages']) {
      this['current-page']++;
    }
  }

  _onPageChange(page) {
    this['current-page'] = page;
    this.dispatchEvent(new CustomEvent('page-changed', { detail: page }));
  }

  _getPages() {
    const pages = [];
    const maxVisible = 5;

    pages.push(1);

    let start = Math.max(2, this['current-page'] - Math.floor(maxVisible / 2));
    let end = Math.min(this['total-pages'] - 1, this['current-page'] + Math.floor(maxVisible / 2));

    if (this['current-page'] <= Math.floor(maxVisible / 2) + 1) {
      end = Math.min(this['total-pages'] - 1, maxVisible);
    }
    if (this['current-page'] >= this['total-pages'] - Math.floor(maxVisible / 2)) {
      start = Math.max(2, this['total-pages'] - maxVisible + 1);
    }

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < this['total-pages'] - 1) {
      pages.push('...');
    }

    if (this['total-pages'] > 1) {
      pages.push(this['total-pages']);
    }

    return [...new Set(pages)];
  }

  render() {
    return html`
      <div class="pagination">
        <dashboard-button ?disabled=${this['current-page'] <= 1} variant="text" @click=${this._onPreviousPage}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-left-icon lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" /></svg
        ></dashboard-button>
        ${this._getPages().map((page) => {
          if (page === '...') {
            return html`<span class="pagination-ellipsis">...</span>`;
          }
          return html`
            <button
              type="button"
              class=${classMap({
                'pagination-button': true,
                active: this['current-page'] === page,
              })}
              @click=${() => this._onPageChange(page)}
            >
              ${page}
            </button>
          `;
        })}

        <dashboard-button
          ?disabled=${this['current-page'] >= this['total-pages']}
          variant="text"
          @click=${this._onNextPage}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-right-icon lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6" /></svg
        ></dashboard-button>
      </div>
    `;
  }
}

window.customElements.define('dashboard-pagination', DashboardPagination);
