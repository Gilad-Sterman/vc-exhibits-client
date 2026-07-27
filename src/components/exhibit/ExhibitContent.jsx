import { useDispatch, useSelector } from 'react-redux'
import { setLang } from '../../redux/slices/uiSlice'

function ExhibitContent({ exhibit }) {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.ui.lang)

  const hasEnglish = exhibit.title?.en || exhibit.description?.en
  const title = exhibit.title?.[lang] || exhibit.title?.he || ''
  const description = exhibit.description?.[lang] || exhibit.description?.he || ''
  const isRtl = lang === 'he'

  return (
    <div className="exhibit-content">
      <div className="exhibit-content__meta">
        <span className="exhibit-number">#{exhibit.exhibitNumber}</span>
        {hasEnglish && (
          <div className="lang-toggle">
            <button
              className={lang === 'he' ? 'active' : ''}
              onClick={() => dispatch(setLang('he'))}
            >
              עב
            </button>
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => dispatch(setLang('en'))}
            >
              EN
            </button>
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
