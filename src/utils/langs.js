export const LANGS = [
  { code: 'he', label: 'עב', dir: 'rtl' },
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'es', label: 'ES', dir: 'ltr' },
]

export const getLangDir = (code) =>
  LANGS.find((l) => l.code === code)?.dir ?? 'ltr'

export const isRtlLang = (code) => getLangDir(code) === 'rtl'
