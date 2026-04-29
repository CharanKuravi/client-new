export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <span className="section-label">About Us</span>
            <h2 className="section-title">Crafting Visual Excellence Since 2015</h2>
            <p>Fashion Studio represents the pinnacle of contemporary photography. Our award-winning team combines technical mastery with artistic vision to create imagery that transcends the ordinary.</p>
            <p>With over a decade of experience working with international fashion houses, luxury brands, and prestigious publications, we bring unparalleled expertise to every project.</p>
            <div className="stats">
              <div className="stat-item"><h3>500+</h3><p>Projects Completed</p></div>
              <div className="stat-item"><h3>150+</h3><p>Global Brands</p></div>
              <div className="stat-item"><h3>25+</h3><p>Industry Awards</p></div>
            </div>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=1000&fit=crop" alt="Studio Photography" className="about-img" />
          </div>
        </div>
      </div>
    </section>
  )
}
