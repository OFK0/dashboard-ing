import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';

class DashboardModal extends LitElement {
  static styles = css`
    :host .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
    }

    :host .modal.is-open {
      display: flex;
    }

    :host .modal-content {
      position: relative;
      background: white;
      padding: 16px;
      border-radius: 4px;
      max-width: 90%;
      min-height: 200px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 768px) {
      :host .modal-content {
        min-width: 450px;
      }
    }

    :host .modal-close-button {
      background: transparent;
      border: none;
      cursor: pointer;
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 36px;
      color: var(--primary-color);
    }
  `;

  static properties = {
    open: { type: Boolean },
  };

  constructor() {
    super();
    this.open = false;
  }

  render() {
    return html`
      <div class=${classMap({ modal: true, 'is-open': this.open })}>
        <div class="modal-content">
          <slot></slot>
          <button class="modal-close-button" @click=${() => (this.open = false)}>&times;</button>
        </div>
      </div>
    `;
  }
}

customElements.define('dashboard-modal', DashboardModal);
