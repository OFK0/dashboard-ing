import { LitElement, html, css } from 'lit';

export class DashboardButton extends LitElement {
  static styles = css`
    :host button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 12px 16px;
      font-size: 16px;
      cursor: pointer;
      border: 1px solid var(--primary-color);
      transition: opacity 0.2s ease;
    }

    :host([size='small']) button {
      padding: 8px 16px;
    }

    :host button:hover {
      opacity: 0.8;
    }

    :host button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    :host([variant='secondary']) button {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);
    }

    :host([variant='outlined']) button {
      background-color: white;
      color: var(--secondary-color);
      border-color: var(--secondary-color);
    }

    :host([variant='text']) button {
      background-color: transparent;
      border-color: transparent;
      color: var(--primary-color);
      opacity: 1;
      transition: opacity 0.2s ease;
    }

    :host([variant='text']) button:hover {
      opacity: 0.5;
    }

    :host([rounded]) button {
      border-radius: 100%;
    }

    :host([disabled]:not([variant='default'])) button {
      color: #a8a8a8;
    }

    :host([fullWidth]) button {
      display: flex;
      width: 100%;
      justify-content: center;
    }
  `;

  static properties = {
    variant: { type: String },
    rounded: { type: Boolean },
    disabled: { type: Boolean },
    size: { type: String },
    type: { type: String },
    fullWidth: { type: Boolean },
  };

  constructor() {
    super();

    this.variant = 'primary';
    this.size = 'default';
    this.rounded = false;
    this.disabled = false;
    this.type = 'button';
    this.fullWidth = false;
  }

  _onClick() {
    if (this.disabled) return;

    if (this.type === 'submit') {
      const form = this.closest('form');
      if (!form) return;

      if (form.reportValidity()) form.dispatchEvent(new Event('submit'));
      return;
    }

    this.dispatchEvent(new Event('click'));
  }

  render() {
    return html`
      <button .type=${this.type} ?disabled=${this.disabled} @click=${this._onClick}>
        <slot></slot>
      </button>
    `;
  }
}

window.customElements.define('dashboard-button', DashboardButton);
