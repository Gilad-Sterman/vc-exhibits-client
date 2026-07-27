import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchAdminExhibits,
  deleteExhibitAdmin,
  togglePublishAdmin,
} from '../redux/slices/exhibitSlice'

function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { adminExhibits, adminLoading } = useSelector((state) => state.exhibit)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    dispatch(fetchAdminExhibits())
  }, [dispatch])

  const handleDelete = async (id) => {
    await dispatch(deleteExhibitAdmin(id))
    setConfirmDeleteId(null)
  }

  const sorted = [...adminExhibits].sort((a, b) =>
    a.order !== b.order ? a.order - b.order : a.exhibitNumber - b.exhibitNumber
  )

  return (
    <>
      <div className="admin-page-header">
        <h1>Exhibits</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/exhibits/new')}>
          + Add Exhibit
        </button>
      </div>

      {adminLoading && <p className="admin-loading">Loading…</p>}

      {!adminLoading && sorted.length === 0 && (
        <p className="admin-empty">No exhibits yet. Add your first one above.</p>
      )}

      {sorted.length > 0 && (
        <div className="exhibit-list">
          {sorted.map((exhibit) => (
            <div className="exhibit-row" key={exhibit._id}>
              <span className="exhibit-row__num">#{exhibit.exhibitNumber}</span>

              <div className="exhibit-row__titles">
                <span className="exhibit-row__title-he">{exhibit.title?.he || '—'}</span>
                {exhibit.title?.en && (
                  <span className="exhibit-row__title-en">{exhibit.title.en}</span>
                )}
              </div>

              <button
                className={`publish-badge${exhibit.isPublished ? ' publish-badge--on' : ''}`}
                onClick={() => dispatch(togglePublishAdmin(exhibit._id))}
                title={exhibit.isPublished ? 'Click to unpublish' : 'Click to publish'}
              >
                {exhibit.isPublished ? 'Published' : 'Draft'}
              </button>

              <div className="exhibit-row__actions">
                <button
                  className="btn-outline btn-sm"
                  onClick={() => navigate(`/admin/exhibits/${exhibit._id}/edit`)}
                >
                  Edit
                </button>

                {confirmDeleteId === exhibit._id ? (
                  <>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(exhibit._id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn-ghost btn-sm"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => setConfirmDeleteId(exhibit._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default AdminDashboard
