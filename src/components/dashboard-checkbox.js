import { html, css, LitElement } from 'lit';

export class DashboardCheckbox extends LitElement {
  static styles = css`
    .checkbox-container {
      display: flex;
      align-items: center;
      position: relative;
      font-size: 22px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      height: 20px;
      padding-right: 20px;
    }

    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 20px;
      width: 20px;
      background-color: #fff;
      border-radius: 6px;
      border: 1px solid #aca7a7;
      transition: all 0.2s ease;
    }

    .checkbox-container:hover input ~ .checkmark {
      background-color: #eee;
      border-color: #979494;
    }

    .checkbox-container input:disabled ~ .checkmark {
      background-color: #fff;
      border-color: #cbcbcbff;
      cursor: not-allowed;
    }

    .checkbox-container input:checked ~ .checkmark {
      border-color: var(--primary-color);
      background-color: var(--primary-color);
    }

    .checkmark:after {
      content: '';
      position: absolute;
      display: none;
    }

    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }

    .checkbox-container .checkmark:after {
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  `;

  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
  };

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
  }

  _onChange(event) {
    this.checked = event.target.checked;
    this.dispatchEvent(new Event('checked-changed'));
  }

  render() {
    return html`
      <label class="checkbox-container">
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this._onChange}
        />
        <span class="checkmark"></span>
      </label>
    `;
  }
}

window.customElements.define('dashboard-checkbox', DashboardCheckbox);
