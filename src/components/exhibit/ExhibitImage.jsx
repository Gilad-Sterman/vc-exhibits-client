function ExhibitImage({ url, title }) {
  if (!url) {
    return <div className="exhibit-image exhibit-image--placeholder" aria-hidden="true" />
  }

  return (
    <img
      className="exhibit-image"
      src={url}
      alt={title || ''}
      loading="eager"
    />
  )
}

export default ExhibitImage
