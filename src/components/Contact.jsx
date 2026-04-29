import { useState } from 'react'
import { useStudio } from '../context/StudioContext'

export default function Contact() {
  const { addInquiry } = useStudio()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addInquiry(formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', service: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">Let's Create Something Extraordinary</h2>
            <p>Ready to elevate your brand with world-class photography? Our team is here to bring your vision to life.</p>
            <div className="contact-details">
              <div className="contact-item"><h4>Email</h4><p>hello@fashionstudio.com</p></div>
              <div className="contact-item"><h4>Phone</h4><p>+91 98480 78999</p></div>
              <div className="contact-item"><h4>Studio</h4><p>Tirupati, Andhra Pradesh</p></div>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <div className="contact-form-header">
              <div className="traffic-lights">
                <span className="light red"></span>
                <span className="light yellow"></span>
                <span className="light green"></span>
              </div>
            </div>
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group"><input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required /></div>
                <div className="form-group"><input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required /></div>
                <div className="form-group"><input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} /></div>
                <div className="form-group">
                  <select name="service" value={formData.service} onChange={handleChange} required>
                    <option value="">Select Service</option>
                    <option value="Editorial Photography">Editorial Photography</option>
                    <option value="Commercial Campaign">Commercial Campaign</option>
                    <option value="Luxury Portrait">Luxury Portrait</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="Wedding">Wedding</option>
                  </select>
                </div>
                <div className="form-group"><textarea name="message" placeholder="Tell us about your project" rows="4" value={formData.message} onChange={handleChange} required></textarea></div>
                <button type="submit" className="btn btn-primary">Send Inquiry</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
