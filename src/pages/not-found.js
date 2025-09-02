import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import '../components/dashboard-layout';
import '../components/dashboard-button';

export class NotFound extends LitElement {
  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`<dashboard-layout title="${msg('Page Not Found')}">
      <div>${msg("The page you're looking for not found.")}</div>
    </dashboard-layout>`;
  }
}

window.customElements.define('dashboard-not-found', NotFound);
