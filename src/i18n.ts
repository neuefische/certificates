import en from './assets/dictionary/en';

export function t(key: string, lang: 'en' | 'de'): string {
  if (lang === 'en') {
    return en[key] || key;
  }
  return key;
}
