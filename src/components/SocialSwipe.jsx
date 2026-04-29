import { useState, useRef } from 'react'
import './SocialSwipe.css'

const SOCIALS = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@fashion_studio_tirupati',
    url: 'https://www.instagram.com/fashion_studio_tirupati?igsh=Z2o2cnBydTJ1cXpv',
    bg: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
      </svg>
    ),
    action: 'Follow Us',
    swipeLabel: 'Swipe to Follow',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@fashionstudiosekhar6276',
    url: 'https://youtube.com/@fashionstudiosekhar6276?si=1L-tEZ5eEP1LMenK',
    bg: 'linear-gradient(135deg, #FF0000 0%, #cc0000 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    action: 'Watch Now',
    swipeLabel: 'Swipe to Watch',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'fashiostudios',
    url: 'https://www.facebook.com/fashiostudios',
    bg: 'linear-gradient(135deg, #1877F2 0%, #0d5dbf 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    action: 'Like Page',
    swipeLabel: 'Swipe to Like',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    handle: '+91 98480 78999',
    url: 'https://wa.me/919848078999',
    bg: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.148.547 4.256 1.582 6.12L0 24l6.12-1.582C9.744 23.453 10.852 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.84 0-3.64-.467-5.24-1.35l-.376-.2-3.898 1.008 1.008-3.898-.2-.376C1.467 15.64 1 13.84 1 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10zm5.5-7.5c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.08-.12-.27-.2-.57-.35z"/>
      </svg>
    ),
    action: 'Chat Now',
    swipeLabel: 'Swipe to Chat',
  },
]

function SocialCard({ social, index }) {
  const [swiped, setSwiped] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const threshold = 80

  const handleDragStart = (e) => {
    setIsDragging(true)
    startX.current = e.touches ? e.touches[0].clientX : e.clientX
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    const currentX = e.touches ? e.touches[0].clientX : e.clientX
    const diff = currentX - startX.current
    if (diff > 0) setDragX(Math.min(diff, threshold + 20))
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (dragX >= threshold) {
      setSwiped(true)
      setTimeout(() => {
        window.open(social.url, '_blank', 'noopener,noreferrer')
        setSwiped(false)
        setDragX(0)
      }, 400)
    } else {
      setDragX(0)
    }
  }

  const progress = Math.min(dragX / threshold, 1)

  return (
    <div
      className="social-swipe-card"
      style={{ '--card-bg': social.bg, animationDelay: `${index * 0.1}s` }}
    >
      {/* Background glow */}
      <div className="card-glow" style={{ background: social.bg, opacity: 0.15 + progress * 0.2 }} />

      {/* Card content */}
      <div className="card-top">
        <div className="card-icon-wrap" style={{ background: social.bg }}>
          {social.icon}
        </div>
        <div className="card-text">
          <span className="card-platform">{social.label}</span>
          <span className="card-handle">{social.handle}</span>
        </div>
        <a href={social.url} target="_blank" rel="noopener noreferrer" className="card-visit-btn">
          Visit
        </a>
      </div>

      {/* Swipe track */}
      <div className="swipe-track">
        <div className="swipe-track-fill" style={{ width: `${progress * 100}%`, background: social.bg }} />

        {/* Draggable thumb */}
        <div
          className={`swipe-thumb ${swiped ? 'swiped' : ''}`}
          style={{
            transform: `translateX(${dragX}px)`,
            background: social.bg,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {swiped ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          )}
        </div>

        <span className="swipe-label" style={{ opacity: 1 - progress }}>
          {social.swipeLabel}
        </span>
        <span className="swipe-label-go" style={{ opacity: progress }}>
          {social.action} →
        </span>
      </div>
    </div>
  )
}

export default function SocialSwipe() {
  return (
    <section className="social-swipe-section">
      <div className="container">
        <div className="social-swipe-header">
          <span className="section-label">Connect With Us</span>
          <h2 className="social-swipe-title">Find Us On Social</h2>
          <p className="social-swipe-sub">Swipe right on any card to visit our social media</p>
        </div>
        <div className="social-swipe-grid">
          {SOCIALS.map((social, i) => (
            <SocialCard key={social.id} social={social} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
