import { useSelector } from 'react-redux'
import { t as translate } from '../utils/i18n'
import { isRtlLang } from '../utils/langs'

function useTranslation() {
  const lang = useSelector((state) => state.ui.lang)
  const t = (key, ...args) => translate(lang, key, ...args)
  return { t, lang, isRtl: isRtlLang(lang) }
}

export default useTranslation
