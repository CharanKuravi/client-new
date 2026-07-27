import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>FASHION STUDIO</h3>
            <p>Elevating brands through visionary photography</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li><a href="#services">Editorial</a></li>
                <li><a href="#services">Commercial</a></li>
                <li><a href="#services">Portraits</a></li>
                <li><a href="#services">Brand Identity</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Follow</h4>
              <ul>
                <li><a href="https://www.instagram.com/fashion_studio_tirupati" target="_blank" rel="noreferrer">Instagram</a></li>
                <li><a href="https://www.facebook.com/fashiostudios" target="_blank" rel="noreferrer">Facebook</a></li>
                <li><a href="https://youtube.com/@fashionstudiosekhar6276" target="_blank" rel="noreferrer">YouTube</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Fashion Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
