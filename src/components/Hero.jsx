import { useStudio } from '../context/StudioContext'

export default function Hero() {
  const { heroPhotos } = useStudio()

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-header">
          <div className="traffic-lights">
            <span className="light red"></span>
            <span className="light yellow"></span>
            <span className="light green"></span>
          </div>
        </div>
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line"></span>
              <span className="hero-subtitle">Real Adventures From Real Couples</span>
              <span className="hero-eyebrow-line"></span>
            </div>
            <h1 className="hero-title">
              Fashion Studio's
              <strong>Portfolio</strong>
            </h1>
            <div className="hero-divider">
              <span className="hero-divider-line"></span>
              <span className="hero-divider-diamond"></span>
              <span className="hero-divider-line"></span>
            </div>
            <p className="hero-description">Based in Sedona, Arizona &nbsp;·&nbsp; Traveling anywhere in the U.S &amp; Beyond</p>
            <div className="hero-buttons">
              <a href="#portfolio" className="btn btn-primary">View Portfolio</a>
              <a href="#contact" className="btn btn-secondary">Book a Session</a>
            </div>
          </div>
          <div className="hero-polaroids">
            {heroPhotos.map((photo) => (
              <div key={photo.id} className="stat-polaroid" style={{ transform: `rotate(${photo.rotate})` }}>
                <img src={photo.url} alt={photo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
