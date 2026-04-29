import { useStudio } from '../context/StudioContext'
import CircularGallery from './CircularGallery'

export default function DomeGallery() {
  const { galleryItems } = useStudio()

  return (
    <section className="dome-gallery-section">
      <div className="container">
        <div className="section-header centered">
          <span className="section-label">Gallery</span>
          <h2 className="section-title">Explore Our Work</h2>
          <p className="section-description" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Scroll or drag to explore our fashion photography
          </p>
        </div>
      </div>
      <div style={{ height: '600px', position: 'relative' }}>
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollSpeed={2}
          scrollEase={0.02}
        />
      </div>
    </section>
  )
}
