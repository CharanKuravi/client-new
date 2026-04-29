import { useStudio } from '../context/StudioContext'

export default function Testimonials() {
  const { testimonials } = useStudio()

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header centered">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">What Clients Say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <h4>{t.author}</h4>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
