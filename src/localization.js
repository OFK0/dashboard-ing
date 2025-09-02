import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales, allLocales } from './generated/locale-codes';
import * as templatesTR from './generated/locales/tr';
import store from './store';

const localizedTemplates = new Map();
localizedTemplates.set('tr', templatesTR);

const { setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: async locale => localizedTemplates.get(locale),
});

const init = async () => {
  const html = document.querySelector('html');

  let storedApplied = false;

  const storedLocale = store.getState().locale;
  if (storedLocale && allLocales.includes(storedLocale)) {
    html.setAttribute('lang', storedLocale);
    await setLocale(storedLocale);
    storedApplied = true;
  }

  const htmlLang = html?.getAttribute('lang');
  if (!storedApplied && htmlLang && allLocales.includes(htmlLang)) {
    await setLocale(htmlLang);
    store.getState().changeLocale(htmlLang);
  }

  // Add event listener for 'lang' attribute changes
  const langAttributeChangeListener = mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'lang') {
        const newLangValue = html?.getAttribute('lang');

        if (newLangValue && allLocales.includes(newLangValue)) {
          setLocale(newLangValue);
          store.getState().changeLocale(newLangValue);
        }
      }
    });
  };

  // Check if MutationObserver is supported
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(langAttributeChangeListener);

    observer.observe(html, { attributes: true });
  } else {
    // Fallback to DOMAttrModified for older browsers
    html?.addEventListener('DOMAttrModified', e => langAttributeChangeListener([e]));
  }
};

export default init;
