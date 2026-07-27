import { useStudio } from '../context/StudioContext'

export default function Portfolio() {
  const { portfolio } = useStudio()

  return (
    <section id="portfolio" className="portfolio">
      <div className="container-fluid">
        <div className="section-header centered">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">Our Work Speaks</h2>
        </div>
        <div className="portfolio-grid">
          {portfolio.map((item) => (
            <div key={item.id} className={`portfolio-item${item.tall ? ' tall' : ''}${item.wide ? ' wide' : ''}`}>
              <img src={item.url} alt={item.title} className="portfolio-img" />
              <div className="portfolio-overlay">
                <h4>{item.title}</h4>
                <span>{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
