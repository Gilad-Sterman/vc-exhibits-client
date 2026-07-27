const translations = {
  he: {
    next: 'הבא',
    prev: 'הקודם',
    allExhibits: 'כל התצוגות',
    selectExhibit: 'בחר תצוגה',
    audioGuide: 'מדריך שמע',
    exhibitNotFound: 'תצוגה לא נמצאה',
    exhibitUnavailable: 'הדף המבוקש אינו זמין כרגע.',
    exhibitNumber: (n) => `תצוגה #${n}`,
    browseExhibits: 'צפה בתצוגות',
  },
  en: {
    next: 'Next',
    prev: 'Prev',
    allExhibits: 'All Exhibits',
    selectExhibit: 'Select Exhibit',
    audioGuide: 'Audio Guide',
    exhibitNotFound: 'Exhibit Not Found',
    exhibitUnavailable: 'This exhibit is not currently available.',
    exhibitNumber: (n) => `Exhibit #${n}`,
    browseExhibits: 'Browse Exhibits',
  },
}

export const t = (lang, key, ...args) => {
  const val = translations[lang]?.[key] ?? translations.he[key] ?? key
  return typeof val === 'function' ? val(...args) : val
}

export default translations
