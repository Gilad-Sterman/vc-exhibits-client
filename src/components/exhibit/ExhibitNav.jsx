import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useTranslation from '../../hooks/useTranslation'

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

function ExhibitNav({ currentNumber }) {
  const navigate = useNavigate()
  const { t, lang, isRtl } = useTranslation()
  const allExhibits = useSelector((state) => state.exhibit.allExhibits)
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    if (showDrawer) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showDrawer])

  const sorted = [...allExhibits].sort((a, b) =>
    a.order !== b.order ? a.order - b.order : a.exhibitNumber - b.exhibitNumber
  )

  const currentIndex = sorted.findIndex((e) => e.exhibitNumber === Number(currentNumber))
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null

  const goTo = (num) => {
    setShowDrawer(false)
    navigate(`/exhibit/${num}`)
  }

  return (
    <>
      {/* dir="rtl" on the flex container flips child order visually:
          PrevBtn (first) → right side in RTL, left side in LTR
          NextBtn (last)  → left side in RTL, right side in LTR       */}
      <nav className="exhibit-nav" dir={isRtl ? 'rtl' : 'ltr'}>
        <button
          className="nav-btn"
          onClick={() => prev && goTo(prev.exhibitNumber)}
          disabled={!prev}
          aria-label="Previous exhibit"
        >
          {isRtl ? <ChevronRight /> : <ChevronLeft />}
          <span>{t('prev')}</span>
        </button>

        <button className="nav-center" onClick={() => setShowDrawer(true)} aria-label="Jump to exhibit">
          <span className="nav-exhibit-num">#{currentNumber}</span>
          <span className="nav-exhibit-hint">{t('allExhibits')}</span>
        </button>

        <button
          className="nav-btn"
          onClick={() => next && goTo(next.exhibitNumber)}
          disabled={!next}
          aria-label="Next exhibit"
        >
          <span>{t('next')}</span>
          {isRtl ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </nav>

      {showDrawer && (
        <>
          <div className="drawer-overlay" onClick={() => setShowDrawer(false)} />
          <div
            className="exhibit-jump-drawer"
            dir={isRtl ? 'rtl' : 'ltr'}
            role="dialog"
            aria-label="Select exhibit"
          >
            <div className="drawer-handle" />
            <p className="drawer-title">{t('selectExhibit')}</p>
            <ul>
              {sorted.map((exhibit) => {
                const title = exhibit.title?.[lang] || exhibit.title?.he || ''
                return (
                  <li key={exhibit._id}>
                    <button
                      className={`drawer-item${exhibit.exhibitNumber === Number(currentNumber) ? ' active' : ''}`}
                      onClick={() => goTo(exhibit.exhibitNumber)}
                    >
                      <span className="drawer-item__num">#{exhibit.exhibitNumber}</span>
                      <span className="drawer-item__title">{title}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </>
  )
}

export default ExhibitNav
