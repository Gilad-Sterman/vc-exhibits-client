import { useSelector } from 'react-redux'
import { t as translate } from '../utils/i18n'

function useTranslation() {
  const lang = useSelector((state) => state.ui.lang)
  const t = (key, ...args) => translate(lang, key, ...args)
  return { t, lang, isRtl: lang === 'he' }
}

export default useTranslation
