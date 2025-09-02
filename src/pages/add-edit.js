import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import dayjs from 'dayjs';
import store from '../store';
import '../components/dashboard-layout';
import '../components/dashboard-button';

export class AddEdit extends LitElement {
  static styles = css`
    .add-edit-page-container {
      background-color: white;
      border-radius: 4px;
      border-bottom: 1px solid #e0e0e0;
      padding: 36px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .add-edit-page-container-inner {
      display: grid;
      grid-template-columns: 1fr;
      gap: 42px;
    }

    @media (min-width: 768px) {
      .add-edit-page-container-inner {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .form-group {
      display: block;

      label {
        display: block;
        font-size: 14px;
        margin-bottom: 6px;
        color: #333;
      }

      input,
      select {
        display: block;
        box-sizing: border-box;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        color: #333;
        background-color: #fff;
        transition: border-color 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }

      select {
        appearance: none; /* Disable the default arrow */
        -webkit-appearance: none; /* For WebKit-based browsers */
        -moz-appearance: none; /* For Firefox */
        padding-right: 32px;
        background-color: #fff;
        background-image: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/></svg>');
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 20px;
        cursor: pointer;
      }
    }

    .action-buttons {
      display: block;
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }

    .error-message {
      color: red;
      font-size: 14px;
      margin-top: 12px;
      text-align: center;
    }
  `;

  static properties = {
    _data: { type: Object },
    _errorMessage: { type: String, state: true },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this._errorMessage = '';
    this._data = {
      first_name: '',
      last_name: '',
      date_of_employment: '',
      date_of_birth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
  }

  _inputHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    const input = e.target;

    let value;

    switch (input.type) {
      case 'checkbox':
        value = input.checked;
        break;
      case 'date':
        value = input.value;
        break;

      default:
        value = input.value;
        break;
    }

    // update property using name attribute
    const property = input.getAttribute('name');
    this._data = { ...this._data, [property]: value };
  }

  _onFormSubmit(e) {
    this._errorMessage = '';

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    const currentData = store.getState().findEmployeeById(this.location?.params?.id) ?? null;

    const isAdd = window.location.pathname === '/add';

    const isEmailExists = store.getState().findEmployeeByEmail(formValues.email);

    if (isEmailExists && (isAdd || currentData?.email === formValues.email)) {
      this._errorMessage = msg('Email already exists');
      return;
    }

    const isPhoneExists = store.getState().findEmployeeByPhone(formValues.phone);

    if (isPhoneExists && (isAdd || currentData?.phone === formValues.phone)) {
      this._errorMessage = msg('Phone already exists');
      return;
    }

    if (isAdd) {
      store.getState().addEmployee({ id: Date.now(), ...formValues });
    } else {
      store.getState().updateEmployeeById(Number(this.location.params.id), formValues);
    }

    window.location.href = '/';
  }

  _setInitialData() {
    if (!this.location.params?.id || window.location.pathname === '/add') {
      return;
    }

    const foundData = store.getState().findEmployeeById(Number(this.location.params.id));

    if (!foundData) {
      return;
    }

    this._data = {
      ...this._data,
      ...foundData,
      date_of_employment: dayjs(foundData.date_of_employment).format('YYYY-MM-DD'),
      date_of_birth: dayjs(foundData.date_of_birth).format('YYYY-MM-DD'),
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this._setInitialData();
  }

  render() {
    return html`<dashboard-layout title=${window.location.pathname === '/add' ? msg('Add Employee') : msg('Edit Employee')}>
      <div class="add-edit-page-container">
        <form @submit=${this._onFormSubmit}>
          <div class="add-edit-page-container-inner">
            <div class="form-group">
              <label for="first-name-input">${msg('First Name')}</label>
              <input
                type="text"
                name="first_name"
                id="first-name-input"
                required
                minlength="2"
                maxlength="100"
                .value=${this._data.first_name || null}
                @input=${this._inputHandler}
              />
            </div>

            <div class="form-group">
              <label for="last-name-input">${msg('Last Name')}</label>
              <input
                type="text"
                name="last_name"
                id="last-name-input"
                required
                minlength="2"
                maxlength="100"
                .value=${this._data.last_name || null}
                @input=${this._inputHandler}
              />
            </div>

            <div class="form-group">
              <label for="date-of-employment-input">${msg('Date of Employment')}</label>
              <input
                type="date"
                name="date_of_employment"
                id="date-of-employment-input"
                required
                .value=${this._data.date_of_employment || null}
                @input=${this._inputHandler}
              />
            </div>

            <div class="form-group">
              <label for="date-of-birth-input">${msg('Date of Birth')}</label>
              <input
                type="date"
                name="date_of_birth"
                id="date-of-birth-input"
                required
                .value=${this._data.date_of_birth || null}
                @input=${this._inputHandler}
              />
            </div>

            <div class="form-group">
              <label for="phone-input">${msg('Phone')} <small>(Format: +90 555 444 3322)</small></label>
              <input
                type="text"
                name="phone"
                id="phone-input"
                placeholder="+90 555 444 3322"
                required
                pattern="^\\+90\\s\\d{3}\\s\\d{3}\\s(\\d{2}\\s\\d{2}|\\d{4})$"
                .value=${this._data.phone || null}
                @input=${this._inputHandler}
              />
            </div>

            <div class="form-group">
              <label for="email-input">E-Mail</label>
              <input
                type="email"
                name="email"
                id="email-input"
                required
                .value=${this._data.email || null}
                @input=${this._inputHandler}
              />
            </div>

            <div class="form-group">
              <label for="department-input">${msg('Department')}</label>
              <select name="department" id="department-input" required @change=${this._inputHandler}>
                <option value="" ?selected=${this._data.department === ''}>${msg('Select')}</option>
                <option value="Analytics" ?selected=${this._data.department === 'Analytics'}>${msg('Analytics')}</option>
                <option value="Tech" ?selected=${this._data.department === 'Tech'}>${msg('Tech')}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="position-input">${msg('Position')}</label>
              <select name="position" id="position-input" required @change=${this._inputHandler}>
                <option value="" ?selected=${this._data.position === ''}>${msg('Select')}</option>
                <option value="Junior" ?selected=${this._data.position === 'Junior'}>${msg('Junior')}</option>
                <option value="Medior" ?selected=${this._data.position === 'Medior'}>${msg('Medior')}</option>
                <option value="Senior" ?selected=${this._data.position === 'Senior'}>${msg('Senior')}</option>
              </select>
            </div>
          </div>

          <div class="action-buttons">
            <dashboard-button type="submit" variant="default">${msg('Submit')}</dashboard-button>
            <a href="/">
              <dashboard-button variant="outlined">${msg('Cancel')}</dashboard-button>
            </a>
          </div>

          ${this._errorMessage ? html`<div class="error-message">${this._errorMessage}</div>` : ''}
        </form>
      </div>
    </dashboard-layout>`;
  }
}

window.customElements.define('dashboard-add-edit', AddEdit);
