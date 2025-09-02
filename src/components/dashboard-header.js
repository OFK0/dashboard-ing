import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import store from '../store';

const logoUrl = new URL('../assets/logo.svg', import.meta.url).href;
const employeeIconUrl = new URL('../assets/icons/employee.svg', import.meta.url).href;
const addIconUrl = new URL('../assets/icons/add.svg', import.meta.url).href;

export class DashboardHeader extends LitElement {
  static styles = css`
    header {
      height: auto;
      background-color: white;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-start;
      padding: 20px;
      box-sizing: border-box;
      gap: 20px;
    }

    @media (min-width: 768px) {
      header {
        height: 70px;
        gap: 0;
        align-items: center;
        flex-direction: row;
      }
    }

    .logo-outer {
      display: flex;
      align-items: center;
      gap: 18px;
      font-size: 20px;
      color: black;
      text-decoration: none;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .logo-outer {
        margin: 0;
      }
    }

    nav {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        gap: 30px;

        li {
          a {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            color: var(--primary-color);
            opacity: 0.5;
            font-size: 18px;
            transition: opacity 0.2s ease;

            &:hover,
            &.active {
              opacity: 1;
            }

            img {
              width: 24px;
            }
          }
        }
      }
    }

    .language-button {
      background: none;
      border: none;
      cursor: pointer;

      img {
        display: block;
      }
    }

    .right-side-container {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-direction: column;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .right-side-container {
        flex-direction: row;
        margin: 0;
      }
    }
  `;

  static properties = {
    _language: { type: String, state: true },
  };

  set language(value) {
    this._language = value;
    document.documentElement.lang = value;
  }

  get language() {
    return this._language;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);

    this.language = store.getState().locale || 'en';
  }

  _getLanguageIconUrl() {
    const lang = this.language.toLowerCase();

    return new URL(`../assets/icons/${lang}.svg`, import.meta.url).href;
  }

  _toggleLanguage() {
    this.language = this.language === 'en' ? 'tr' : 'en';
  }

  _isActiveRoute(route) {
    return window.location.pathname === route ? 'active' : '';
  }

  render() {
    return html`
      <header>
        <a href="/" class="logo-outer">
          <img src="${logoUrl}" alt="Logo" width="36" height="36" />
          <span>ING</span>
        </a>

        <div class="right-side-container">
          <nav>
            <ul>
              <li>
                <a href="/" class=${this._isActiveRoute('/')}
                  ><img src="${employeeIconUrl}" alt="Employees" /> ${msg('Employees')}</a
                >
              </li>
              <li>
                <a href="/add" class=${this._isActiveRoute('/add')}
                  ><img src="${addIconUrl}" alt="Add New" /> ${msg('Add New')}</a
                >
              </li>
            </ul>
          </nav>
          <button type="button" class="language-button" @click="${this._toggleLanguage}">
            <img src="${this._getLanguageIconUrl()}" alt="Language" width="36" height="24" />
          </button>
        </div>
      </header>
    `;
  }
}

window.customElements.define('dashboard-header', DashboardHeader);
