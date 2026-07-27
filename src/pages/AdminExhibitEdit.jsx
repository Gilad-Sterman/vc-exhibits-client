import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  fetchAdminExhibits,
  createExhibitAdmin,
  updateExhibitAdmin,
  clearSaveError,
} from '../redux/slices/exhibitSlice'

const EMPTY_FORM = {
  exhibitNumber: '',
  order: '',
  isPublished: false,
  title: { he: '', en: '' },
  description: { he: '', en: '' },
  image: { url: '', publicId: '' },
  audio: {
    he: { url: '', publicId: '' },
    en: { url: '', publicId: '' },
  },
}

function AdminExhibitEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isNew = !id

  const token = useSelector((state) => state.auth.token)
  const { adminExhibits, saveLoading, saveError } = useSelector((state) => state.exhibit)

  const [form, setForm] = useState(EMPTY_FORM)
  const [uploading, setUploading] = useState({ image: false, audioHe: false, audioEn: false })
  const [uploadError, setUploadError] = useState({ image: null, audioHe: null, audioEn: null })

  const imageInputRef = useRef(null)
  const audioHeInputRef = useRef(null)
  const audioEnInputRef = useRef(null)

  useEffect(() => {
    if (!isNew && adminExhibits.length === 0) {
      dispatch(fetchAdminExhibits())
    }
  }, [isNew, dispatch, adminExhibits.length])

  useEffect(() => {
    if (!isNew) {
      const exhibit = adminExhibits.find((e) => e._id === id)
      if (exhibit) {
        setForm({
          exhibitNumber: exhibit.exhibitNumber ?? '',
          order: exhibit.order ?? '',
          isPublished: exhibit.isPublished ?? false,
          title: { he: exhibit.title?.he || '', en: exhibit.title?.en || '' },
          description: { he: exhibit.description?.he || '', en: exhibit.description?.en || '' },
          image: exhibit.image || { url: '', publicId: '' },
          audio: {
            he: exhibit.audio?.he || { url: '', publicId: '' },
            en: exhibit.audio?.en || { url: '', publicId: '' },
          },
        })
      }
    }
    return () => dispatch(clearSaveError())
  }, [id, adminExhibits, isNew, dispatch])

  const setField = (path, value) => {
    setForm((prev) => {
      const [a, b] = path.split('.')
      if (!b) return { ...prev, [a]: value }
      return { ...prev, [a]: { ...prev[a], [b]: value } }
    })
  }

  const handleUpload = async (file, type) => {
    const isImage = type === 'image'
    const endpoint = isImage ? '/api/admin/upload/image' : '/api/admin/upload/audio'
    const fieldName = isImage ? 'image' : 'audio'

    const formData = new FormData()
    formData.append(fieldName, file)

    setUploading((p) => ({ ...p, [type]: true }))
    setUploadError((p) => ({ ...p, [type]: null }))

    try {
      const { data } = await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (type === 'image') {
        setForm((p) => ({ ...p, image: data }))
      } else if (type === 'audioHe') {
        setForm((p) => ({ ...p, audio: { ...p.audio, he: data } }))
      } else {
        setForm((p) => ({ ...p, audio: { ...p.audio, en: data } }))
      }
    } catch (err) {
      setUploadError((p) => ({
        ...p,
        [type]: err.response?.data?.message || 'Upload failed',
      }))
    } finally {
      setUploading((p) => ({ ...p, [type]: false }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const action = isNew
      ? createExhibitAdmin(form)
      : updateExhibitAdmin({ id, ...form })

    const result = await dispatch(action)
    if (!result.error) navigate('/admin')
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>{isNew ? 'New Exhibit' : `Edit Exhibit #${form.exhibitNumber}`}</h1>
        <div className="header-actions">
          <button className="btn-ghost" onClick={() => navigate('/admin')}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saveLoading}>
            {saveLoading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {saveError && <p className="form-error">{saveError}</p>}

      <form className="exhibit-form" onSubmit={handleSubmit}>

        <section className="form-section">
          <h2 className="form-section__title">Basic Info</h2>
          <div className="form-grid form-grid--3">
            <div className="form-field">
              <label>Exhibit Number</label>
              <input
                type="number"
                value={form.exhibitNumber}
                onChange={(e) => setField('exhibitNumber', e.target.value)}
                required
                min={1}
              />
            </div>
            <div className="form-field">
              <label>Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setField('order', e.target.value)}
                min={0}
              />
            </div>
            <div className="form-field form-field--toggle">
              <label>Published</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setField('isPublished', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2 className="form-section__title">Image</h2>
          {form.image?.url && (
            <img className="form-image-preview" src={form.image.url} alt="Preview" />
          )}
          <div className="upload-area">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'image')}
            />
            <button
              type="button"
              className="btn-outline"
              onClick={() => imageInputRef.current.click()}
              disabled={uploading.image}
            >
              {uploading.image ? 'Uploading…' : form.image?.url ? 'Replace Image' : 'Upload Image'}
            </button>
            {uploadError.image && <span className="upload-error">{uploadError.image}</span>}
          </div>
        </section>

        <section className="form-section">
          <h2 className="form-section__title">Hebrew Content</h2>
          <div className="form-field">
            <label>Title (עברית)</label>
            <input
              type="text"
              dir="rtl"
              value={form.title.he}
              onChange={(e) => setField('title.he', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Description (עברית)</label>
            <textarea
              dir="rtl"
              rows={5}
              value={form.description.he}
              onChange={(e) => setField('description.he', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Audio Guide (HE)</label>
            {form.audio.he?.url && (
              <audio controls src={form.audio.he.url} className="form-audio-preview" />
            )}
            <div className="upload-area">
              <input
                ref={audioHeInputRef}
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'audioHe')}
              />
              <button
                type="button"
                className="btn-outline"
                onClick={() => audioHeInputRef.current.click()}
                disabled={uploading.audioHe}
              >
                {uploading.audioHe ? 'Uploading…' : form.audio.he?.url ? 'Replace Audio' : 'Upload Audio'}
              </button>
              {uploadError.audioHe && <span className="upload-error">{uploadError.audioHe}</span>}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2 className="form-section__title">English Content <span className="optional">(optional)</span></h2>
          <div className="form-field">
            <label>Title (English)</label>
            <input
              type="text"
              value={form.title.en}
              onChange={(e) => setField('title.en', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Description (English)</label>
            <textarea
              rows={5}
              value={form.description.en}
              onChange={(e) => setField('description.en', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Audio Guide (EN)</label>
            {form.audio.en?.url && (
              <audio controls src={form.audio.en.url} className="form-audio-preview" />
            )}
            <div className="upload-area">
              <input
                ref={audioEnInputRef}
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'audioEn')}
              />
              <button
                type="button"
                className="btn-outline"
                onClick={() => audioEnInputRef.current.click()}
                disabled={uploading.audioEn}
              >
                {uploading.audioEn ? 'Uploading…' : form.audio.en?.url ? 'Replace Audio' : 'Upload Audio'}
              </button>
              {uploadError.audioEn && <span className="upload-error">{uploadError.audioEn}</span>}
            </div>
          </div>
        </section>

      </form>
    </>
  )
}

export default AdminExhibitEdit
