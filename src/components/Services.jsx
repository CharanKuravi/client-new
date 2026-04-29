import { useStudio } from '../context/StudioContext'

export default function Services() {
  const { services } = useStudio()

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header centered">
          <span className="section-label">What We Offer</span>
          <h2 className="section-title">Premium Services</h2>
          <p className="section-description">Bespoke photography solutions tailored to your vision</p>
        </div>
        <div className="services-grid">
          {services.map((s, idx) => (
            <div key={s.id} className="service-card" style={{ '--card-index': idx }}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <a href="#contact" className="service-link">Learn More →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
