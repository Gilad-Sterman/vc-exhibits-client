import { useDispatch, useSelector } from 'react-redux'
import { setLang } from '../../redux/slices/uiSlice'
import { LANGS, isRtlLang } from '../../utils/langs'

function ExhibitContent({ exhibit }) {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.ui.lang)

  const availableLangs = LANGS.filter(
    (l) => exhibit.title?.[l.code] || exhibit.description?.[l.code]
  )
  const title = exhibit.title?.[lang] || exhibit.title?.he || ''
  const description = exhibit.description?.[lang] || exhibit.description?.he || ''
  const isRtl = isRtlLang(lang)

  return (
    <div className="exhibit-content">
      <div className="exhibit-content__meta">
        <span className="exhibit-number">#{exhibit.exhibitNumber}</span>
        {availableLangs.length > 1 && (
          <div className="lang-toggle">
            {availableLangs.map((l) => (
              <button
                key={l.code}
                className={lang === l.code ? 'active' : ''}
                onClick={() => dispatch(setLang(l.code))}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <h1 className="exhibit-title" dir={isRtl ? 'rtl' : 'ltr'}>
        {title}
      </h1>

      <p
        className={`exhibit-description${isRtl ? ' rtl' : ''}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {description}
      </p>
    </div>
  )
}

export default ExhibitContent
