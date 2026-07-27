import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExhibit, fetchAllExhibits, clearCurrent } from '../redux/slices/exhibitSlice'
import ExhibitImage from '../components/exhibit/ExhibitImage'
import ExhibitContent from '../components/exhibit/ExhibitContent'
import AudioPlayer from '../components/exhibit/AudioPlayer'
import ExhibitNav from '../components/exhibit/ExhibitNav'

function ExhibitPage() {
  const { number } = useParams()
  const dispatch = useDispatch()
  const { current: exhibit, allExhibits, loading, error } = useSelector((state) => state.exhibit)

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
    return (
      <div className="exhibit-page exhibit-page--error">
        <div className="exhibit-error">
          <p className="exhibit-error__code">#{number}</p>
          <h1 className="exhibit-error__title">תצוגה לא נמצאה</h1>
          <p className="exhibit-error__msg">
            {error || 'הדף המבוקש אינו זמין כרגע.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="exhibit-page">
      <ExhibitImage url={exhibit.image?.url} title={exhibit.title?.he} />
      <ExhibitContent exhibit={exhibit} />
      <AudioPlayer audio={exhibit.audio} />
      <ExhibitNav currentNumber={number} />
    </div>
  )
}

export default ExhibitPage
