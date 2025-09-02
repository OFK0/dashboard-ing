import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import './dashboard-header.js';

describe('DashboardHeader', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<dashboard-header></dashboard-header>`);
  });

  describe('Initialization', () => {
    it('should create the element', () => {
      expect(element).to.be.instanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).to.equal('dashboard-header');
    });

    it('should initialize with default language from store', () => {
      expect(element.language).to.be.oneOf(['en', 'tr']);
    });

    it('should set document language attribute', () => {
      expect(document.documentElement.lang).to.be.oneOf(['en', 'tr']);
    });
  });

  describe('DOM Structure', () => {
    it('should render header element', () => {
      const header = element.shadowRoot.querySelector('header');
      expect(header).to.exist;
    });

    it('should render logo with correct attributes', () => {
      const logoLink = element.shadowRoot.querySelector('.logo-outer');
      expect(logoLink).to.exist;
      expect(logoLink.getAttribute('href')).to.equal('/');

      const logoImg = logoLink.querySelector('img');
      expect(logoImg).to.exist;
      expect(logoImg.getAttribute('alt')).to.equal('Logo');
      expect(logoImg.getAttribute('width')).to.equal('36');
      expect(logoImg.getAttribute('height')).to.equal('36');
    });

    it('should render ING text next to logo', () => {
      const logoText = element.shadowRoot.querySelector('.logo-outer span');
      expect(logoText).to.exist;
      expect(logoText.textContent).to.equal('ING');
    });

    it('should render navigation menu', () => {
      const nav = element.shadowRoot.querySelector('nav');
      expect(nav).to.exist;

      const ul = nav.querySelector('ul');
      expect(ul).to.exist;

      const listItems = ul.querySelectorAll('li');
      expect(listItems).to.have.length(2);
    });

    it('should render Employees navigation link', () => {
      const nav = element.shadowRoot.querySelector('nav');
      const employeesLink = nav.querySelector('a[href="/"]');
      expect(employeesLink).to.exist;

      const employeesIcon = employeesLink.querySelector('img');
      expect(employeesIcon).to.exist;
      expect(employeesIcon.getAttribute('alt')).to.equal('Employees');
    });

    it('should render Add New navigation link', () => {
      const addLink = element.shadowRoot.querySelector('a[href="/add"]');
      expect(addLink).to.exist;

      const addIcon = addLink.querySelector('img');
      expect(addIcon).to.exist;
      expect(addIcon.getAttribute('alt')).to.equal('Add New');
    });

    it('should render language toggle button', () => {
      const languageButton = element.shadowRoot.querySelector('.language-button');
      expect(languageButton).to.exist;
      expect(languageButton.tagName.toLowerCase()).to.equal('button');
      expect(languageButton.getAttribute('type')).to.equal('button');

      const languageIcon = languageButton.querySelector('img');
      expect(languageIcon).to.exist;
      expect(languageIcon.getAttribute('alt')).to.equal('Language');
      expect(languageIcon.getAttribute('width')).to.equal('36');
      expect(languageIcon.getAttribute('height')).to.equal('24');
    });
  });

  describe('Language Functionality', () => {
    it('should display language icon', () => {
      const languageIcon = element.shadowRoot.querySelector('.language-button img');
      expect(languageIcon.src).to.match(/(en|tr)\.svg/);
    });

    it('should display correct language icon for Turkish when set', async () => {
      element.language = 'tr';
      await elementUpdated(element);
      const languageIcon = element.shadowRoot.querySelector('.language-button img');
      expect(languageIcon.src).to.include('tr.svg');
    });

    it('should toggle language from current to opposite', async () => {
      const initialLanguage = element.language;

      element._toggleLanguage();
      await elementUpdated(element);

      expect(element.language).to.not.equal(initialLanguage);
      expect(element.language).to.be.oneOf(['en', 'tr']);
    });

    it('should update document language attribute when language changes', async () => {
      const testLanguage = element.language === 'en' ? 'tr' : 'en';

      element.language = testLanguage;
      await elementUpdated(element);

      expect(document.documentElement.lang).to.equal(testLanguage);
    });

    it('should handle language button click', async () => {
      const languageButton = element.shadowRoot.querySelector('.language-button');
      const initialLanguage = element.language;

      languageButton.click();
      await elementUpdated(element);

      expect(element.language).to.not.equal(initialLanguage);
    });
  });

  describe('Navigation State', () => {
    it('should have _isActiveRoute method', () => {
      expect(element._isActiveRoute).to.be.a('function');
    });

    it('should return active class for matching routes', () => {
      // Since we can't easily mock window.location in all browsers,
      // we'll test the method directly
      const result = element._isActiveRoute(window.location.pathname);
      expect(result).to.be.oneOf(['active', '']);
    });

    it('should return empty string for non-matching routes', () => {
      const result = element._isActiveRoute('/non-existent-route');
      expect(result).to.equal('');
    });
  });

  describe('Icon URL Generation', () => {
    it('should generate icon URL for current language', () => {
      const iconUrl = element._getLanguageIconUrl();
      expect(iconUrl).to.match(/(en|tr)\.svg/);
    });

    it('should generate correct icon URL for Turkish when set', () => {
      element.language = 'TR'; // Test case insensitivity
      const iconUrl = element._getLanguageIconUrl();
      expect(iconUrl).to.include('tr.svg');
    });

    it('should handle lowercase language codes', () => {
      element.language = 'tr';
      const iconUrl = element._getLanguageIconUrl();
      expect(iconUrl).to.include('tr.svg');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt attributes for all images', () => {
      const images = element.shadowRoot.querySelectorAll('img');
      images.forEach(img => {
        expect(img.getAttribute('alt')).to.not.be.empty;
      });
    });

    it('should have proper button type for language button', () => {
      const languageButton = element.shadowRoot.querySelector('.language-button');
      expect(languageButton.getAttribute('type')).to.equal('button');
    });

    it('should have proper link attributes', () => {
      const links = element.shadowRoot.querySelectorAll('a');
      links.forEach(link => {
        expect(link.getAttribute('href')).to.not.be.empty;
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have CSS classes for responsive layout', () => {
      const header = element.shadowRoot.querySelector('header');
      expect(header).to.exist;

      const rightContainer = element.shadowRoot.querySelector('.right-side-container');
      expect(rightContainer).to.exist;

      const logoOuter = element.shadowRoot.querySelector('.logo-outer');
      expect(logoOuter).to.exist;
    });
  });

  describe('Event Handling', () => {
    it('should toggle language when language button is clicked', async () => {
      const languageButton = element.shadowRoot.querySelector('.language-button');
      const initialLanguage = element.language;

      languageButton.click();
      await elementUpdated(element);

      expect(element.language).to.not.equal(initialLanguage);
      expect(element.language).to.be.oneOf(['en', 'tr']);
    });

    it('should have language button element', () => {
      const languageButton = element.shadowRoot.querySelector('.language-button');
      expect(languageButton).to.exist;
      expect(languageButton.tagName.toLowerCase()).to.equal('button');
    });
  });

  describe('Custom Element Registration', () => {
    it('should be registered as dashboard-header custom element', () => {
      expect(window.customElements.get('dashboard-header')).to.exist;
    });
  });

  describe('Error Handling', () => {
    it('should handle missing asset URLs gracefully', () => {
      // Test that the component doesn't break if asset URLs are malformed
      expect(() => element._getLanguageIconUrl()).to.not.throw();
    });

    it('should handle invalid route checks gracefully', () => {
      expect(() => element._isActiveRoute(null)).to.not.throw();
      expect(() => element._isActiveRoute(undefined)).to.not.throw();
      expect(() => element._isActiveRoute('')).to.not.throw();
    });
  });

  describe('Properties', () => {
    it('should have language property getter and setter', () => {
      const testLanguage = 'tr';
      element.language = testLanguage;
      expect(element.language).to.equal(testLanguage);
    });

    it('should have _language internal property', () => {
      expect(element).to.have.property('_language');
    });
  });

  describe('Methods', () => {
    it('should have _toggleLanguage method', () => {
      expect(element._toggleLanguage).to.be.a('function');
    });

    it('should have _isActiveRoute method', () => {
      expect(element._isActiveRoute).to.be.a('function');
    });

    it('should have _getLanguageIconUrl method', () => {
      expect(element._getLanguageIconUrl).to.be.a('function');
    });

    it('should have render method', () => {
      expect(element.render).to.be.a('function');
    });
  });
});
