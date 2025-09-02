import { LitElement, html, css } from 'lit';
import { updateWhenLocaleChanges } from '@lit/localize';
import './dashboard-header';

export class DashboardLayout extends LitElement {
  static styles = css`
    .content {
      width: 100%;
      max-width: 1400px;
      box-sizing: border-box;
      padding: 0 24px;
      margin: 0 auto;
      margin-top: 20px;
    }

    .page-heading {
      font-size: 24px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 24px;
    }
  `;

  static properties = {
    title: { type: String },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <main>
        <dashboard-header></dashboard-header>
        <div class="content">
          ${this.title ? html`<h1 class="page-heading">${this.title}</h1>` : ''}
          <slot></slot>
        </div>
      </main>
    `;
  }
}

window.customElements.define('dashboard-layout', DashboardLayout);
