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
import { LANGS, isRtlLang } from '../utils/langs'

const makeLangMap = (val = '') => Object.fromEntries(LANGS.map((l) => [l.code, val]))

const EMPTY_FORM = {
  exhibitNumber: '',
  order: '',
  isPublished: false,
  title: makeLangMap(''),
  description: makeLangMap(''),
  image: { url: '', publicId: '' },
  audio: Object.fromEntries(LANGS.map((l) => [l.code, { url: '', publicId: '' }])),
}

function AdminExhibitEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isNew = !id

  const token = useSelector((state) => state.auth.token)
  const { adminExhibits, saveLoading, saveError } = useSelector((state) => state.exhibit)

  const [form, setForm] = useState(EMPTY_FORM)
  const [activeLang, setActiveLang] = useState(LANGS[0].code)
  const [uploading, setUploading] = useState({ image: false })
  const [uploadError, setUploadError] = useState({ image: null })
  const [audioMode, setAudioMode] = useState(
    Object.fromEntries(LANGS.map((l) => [l.code, 'upload']))
  )
  const [imageMode, setImageMode] = useState('upload')

  const imageInputRef = useRef(null)
  const audioInputRef = useRef(null)

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
          title: Object.fromEntries(LANGS.map((l) => [l.code, exhibit.title?.[l.code] || ''])),
          description: Object.fromEntries(LANGS.map((l) => [l.code, exhibit.description?.[l.code] || ''])),
          image: exhibit.image || { url: '', publicId: '' },
          audio: Object.fromEntries(LANGS.map((l) => [l.code, exhibit.audio?.[l.code] || { url: '', publicId: '' }])),
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

  const handleUpload = async (file, type, lang = null) => {
    const isImage = type === 'image'
    const key = isImage ? 'image' : lang
    const endpoint = isImage ? '/api/admin/upload/image' : '/api/admin/upload/audio'
    const fieldName = isImage ? 'image' : 'audio'

    const formData = new FormData()
    formData.append(fieldName, file)

    setUploading((p) => ({ ...p, [key]: true }))
    setUploadError((p) => ({ ...p, [key]: null }))

    try {
      const { data } = await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (isImage) {
        setForm((p) => ({ ...p, image: data }))
      } else {
        setForm((p) => ({ ...p, audio: { ...p.audio, [lang]: data } }))
      }
    } catch (err) {
      setUploadError((p) => ({ ...p, [key]: err.response?.data?.message || 'Upload failed' }))
    } finally {
      setUploading((p) => ({ ...p, [key]: false }))
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

  const currentLang = LANGS.find((l) => l.code === activeLang)
  const dir = isRtlLang(activeLang) ? 'rtl' : 'ltr'
  const audioUrl = form.audio[activeLang]?.url || ''

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
          <div className="media-tabs">
            <button type="button" className={`media-tab${imageMode === 'upload' ? ' media-tab--active' : ''}`} onClick={() => setImageMode('upload')}>Upload File</button>
            <button type="button" className={`media-tab${imageMode === 'url' ? ' media-tab--active' : ''}`} onClick={() => setImageMode('url')}>Paste URL</button>
          </div>
          {imageMode === 'upload' ? (
            <div className="upload-area">
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'image')} />
              <button type="button" className="btn-outline" onClick={() => imageInputRef.current.click()} disabled={uploading.image}>
                {uploading.image ? 'Uploading…' : form.image?.url ? 'Replace Image' : 'Upload Image'}
              </button>
              {uploadError.image && <span className="upload-error">{uploadError.image}</span>}
            </div>
          ) : (
            <div className="url-input-area">
              <input type="url" placeholder="https://…" value={form.image?.url || ''}
                onChange={(e) => setForm((p) => ({ ...p, image: { url: e.target.value, publicId: '' } }))} />
              {form.image?.url && (
                <button type="button" className="btn-ghost btn-sm" onClick={() => setForm((p) => ({ ...p, image: { url: '', publicId: '' } }))}>Clear</button>
              )}
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="form-section__header">
            <h2 className="form-section__title">Content</h2>
            <div className="lang-tabs">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`lang-tab${activeLang === l.code ? ' lang-tab--active' : ''}`}
                  onClick={() => setActiveLang(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label>Title</label>
            <input
              type="text"
              dir={dir}
              value={form.title[activeLang] || ''}
              onChange={(e) => setField(`title.${activeLang}`, e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              dir={dir}
              rows={5}
              value={form.description[activeLang] || ''}
              onChange={(e) => setField(`description.${activeLang}`, e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Audio Guide — {currentLang?.label}</label>
            {audioUrl && <audio controls src={audioUrl} className="form-audio-preview" />}
            <div className="media-tabs">
              <button type="button" className={`media-tab${audioMode[activeLang] === 'upload' ? ' media-tab--active' : ''}`}
                onClick={() => setAudioMode((p) => ({ ...p, [activeLang]: 'upload' }))}>Upload File</button>
              <button type="button" className={`media-tab${audioMode[activeLang] === 'url' ? ' media-tab--active' : ''}`}
                onClick={() => setAudioMode((p) => ({ ...p, [activeLang]: 'url' }))}>Paste URL</button>
            </div>
            {audioMode[activeLang] === 'upload' ? (
              <div className="upload-area">
                <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: 'none' }}
                  onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'audio', activeLang)} />
                <button type="button" className="btn-outline"
                  onClick={() => audioInputRef.current.click()} disabled={uploading[activeLang]}>
                  {uploading[activeLang] ? 'Uploading…' : audioUrl ? 'Replace Audio' : 'Upload Audio'}
                </button>
                {uploadError[activeLang] && <span className="upload-error">{uploadError[activeLang]}</span>}
              </div>
            ) : (
              <div className="url-input-area">
                <input type="url" placeholder="https://…" value={audioUrl}
                  onChange={(e) => setForm((p) => ({ ...p, audio: { ...p.audio, [activeLang]: { url: e.target.value, publicId: '' } } }))} />
                {audioUrl && (
                  <button type="button" className="btn-ghost btn-sm"
                    onClick={() => setForm((p) => ({ ...p, audio: { ...p.audio, [activeLang]: { url: '', publicId: '' } } }))}>Clear</button>
                )}
              </div>
            )}
          </div>
        </section>

      </form>
    </>
  )
}

export default AdminExhibitEdit
