import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExhibit, fetchAllExhibits, clearCurrent } from '../redux/slices/exhibitSlice'
import useTranslation from '../hooks/useTranslation'
import ExhibitImage from '../components/exhibit/ExhibitImage'
import ExhibitContent from '../components/exhibit/ExhibitContent'
import AudioPlayer from '../components/exhibit/AudioPlayer'
import ExhibitNav from '../components/exhibit/ExhibitNav'

function ExhibitPage() {
  const { number } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { current: exhibit, allExhibits, loading, error } = useSelector((state) => state.exhibit)
  const { t, lang, isRtl } = useTranslation()

  useEffect(() => {
    dispatch(fetchExhibit(number))
    return () => dispatch(clearCurrent())
  }, [number, dispatch])

  useEffect(() => {
    if (allExhibits.length === 0) {
      dispatch(fetchAllExhibits())
    }
  }, [dispatch, allExhibits.length])

  if (loading) {
    return (
      <div className="exhibit-page">
        <div className="exhibit-skeleton">
          <div className="exhibit-skeleton__image" />
          <div className="exhibit-skeleton__body">
            <div className="exhibit-skeleton__line exhibit-skeleton__line--short" />
            <div className="exhibit-skeleton__line exhibit-skeleton__line--title" />
            <div className="exhibit-skeleton__line" />
            <div className="exhibit-skeleton__line" />
            <div className="exhibit-skeleton__line exhibit-skeleton__line--short" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !exhibit) {
    const sorted = [...allExhibits].sort((a, b) =>
      a.order !== b.order ? a.order - b.order : a.exhibitNumber - b.exhibitNumber
    )
    return (
      <div className="exhibit-page exhibit-page--error">
        <div className="exhibit-error" dir={isRtl ? 'rtl' : 'ltr'}>
          <p className="exhibit-error__code">#{number}</p>
          <h1 className="exhibit-error__title">{t('exhibitNotFound')}</h1>
          <p className="exhibit-error__msg">
            {error || t('exhibitUnavailable')}
          </p>

          {sorted.length > 0 && (
            <div className="exhibit-error__browse">
              <p className="exhibit-error__browse-label">{t('browseExhibits')}</p>
              <div className="exhibit-error__list">
                {sorted.map((e) => (
                  <button
                    key={e._id}
                    className="exhibit-error__item"
                    onClick={() => navigate(`/exhibit/${e.exhibitNumber}`)}
                  >
                    <span className="exhibit-error__item-num">#{e.exhibitNumber}</span>
                    <span className="exhibit-error__item-title">
                      {e.title?.[lang] || e.title?.he}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="exhibit-page">
      <ExhibitImage url={exhibit.image?.url} title={exhibit.title?.he} />
      <AudioPlayer audio={exhibit.audio} />
      <ExhibitContent exhibit={exhibit} />
      <ExhibitNav currentNumber={number} />
    </div>
  )
}

export default ExhibitPage
