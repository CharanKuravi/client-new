import { createContext, useContext, useState } from 'react'

const StudioContext = createContext()

const DEFAULT_PORTFOLIO = [
  { id: 1, title: 'Fashion Week 2026', category: 'Editorial', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=600&fit=crop', tall: true },
  { id: 2, title: 'Romantic Wedding',  category: 'Wedding',   url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=600&fit=crop', wide: true },
  { id: 3, title: 'Bridal Elegance',   category: 'Portrait',  url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop' },
  { id: 4, title: 'Haute Couture',     category: 'Fashion',   url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop' },
  { id: 5, title: 'Ceremony Moments',  category: 'Wedding',   url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop', wide: true },
]

const DEFAULT_SERVICES = [
  { id: 1, icon: '01', title: 'Editorial Photography', description: 'Magazine-quality shoots with world-class styling and creative direction for fashion brands and publications.' },
  { id: 2, icon: '02', title: 'Commercial Campaigns',  description: 'Full-scale production for advertising campaigns that captivate audiences and drive brand recognition.' },
  { id: 3, icon: '03', title: 'Luxury Portraits',      description: 'Exclusive portrait sessions for executives, celebrities, and discerning individuals seeking timeless imagery.' },
  { id: 4, icon: '04', title: 'Brand Identity',        description: "Comprehensive visual storytelling to establish and elevate your brand's aesthetic presence." },
]

const DEFAULT_TESTIMONIALS = [
  { id: 1, author: 'Alexandra Chen', role: 'Creative Director, Luxe Magazine',  text: 'Fashion Studio transformed our brand identity with their exceptional vision. The attention to detail and creative excellence is unmatched.' },
  { id: 2, author: 'Marcus Dubois',  role: 'CEO, Maison Élégance',              text: 'Working with this team was an absolute pleasure. They captured the essence of our collection in ways we never imagined possible.' },
  { id: 3, author: 'Sofia Rossi',    role: 'Brand Manager, Bellezza Cosmetics', text: 'The professionalism and artistry displayed throughout our campaign exceeded all expectations. True masters of their craft.' },
]

const DEFAULT_HERO_PHOTOS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop', alt: 'Fashion Photo 1', rotate: '3deg' },
  { id: 2, url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop', alt: 'Fashion Photo 2', rotate: '-4deg' },
  { id: 3, url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop', alt: 'Fashion Photo 3', rotate: '2deg' },
  { id: 4, url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop', alt: 'Fashion Photo 4', rotate: '-3deg' },
  { id: 5, url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop', alt: 'Fashion Photo 5', rotate: '4deg' },
]

const DEFAULT_GALLERY_ITEMS = [
  { id: 1,  url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop&auto=format', text: 'Fashion Shoot' },
  { id: 2,  url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop&auto=format', text: 'Editorial' },
  { id: 3,  url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop&auto=format', text: 'Runway' },
  { id: 4,  url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop&auto=format', text: 'Portrait' },
  { id: 5,  url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop&auto=format', text: 'Street Style' },
  { id: 6,  url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop&auto=format', text: 'Couture' },
  { id: 7,  url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop&auto=format', text: 'Wedding' },
  { id: 8,  url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop&auto=format', text: 'Bridal' },
  { id: 9,  url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&auto=format', text: 'Ceremony' },
  { id: 10, url: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop&auto=format', text: 'Studio' },
]

function load(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch { return fallback }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Convert uploaded file to base64 for localStorage storage
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function StudioProvider({ children }) {
  const [portfolio,    setPortfolioRaw]    = useState(() => load('fs_portfolio',    DEFAULT_PORTFOLIO))
  const [services,     setServicesRaw]     = useState(() => load('fs_services',     DEFAULT_SERVICES))
  const [testimonials, setTestimonialsRaw] = useState(() => load('fs_testimonials', DEFAULT_TESTIMONIALS))
  const [inquiries,    setInquiriesRaw]    = useState(() => load('fs_inquiries',    []))
  const [heroPhotos,   setHeroPhotosRaw]   = useState(() => load('fs_hero_photos',  DEFAULT_HERO_PHOTOS))
  const [galleryItems, setGalleryItemsRaw] = useState(() => load('fs_gallery_v2',     DEFAULT_GALLERY_ITEMS))

  const setPortfolio    = v => { setPortfolioRaw(v);    save('fs_portfolio',    v) }
  const setServices     = v => { setServicesRaw(v);     save('fs_services',     v) }
  const setTestimonials = v => { setTestimonialsRaw(v); save('fs_testimonials', v) }
  const setInquiries    = v => { setInquiriesRaw(v);    save('fs_inquiries',    v) }
  const setHeroPhotos   = v => { setHeroPhotosRaw(v);   save('fs_hero_photos',  v) }
  const setGalleryItems = v => { setGalleryItemsRaw(v); save('fs_gallery_v2',      v) }

  const addInquiry = (data) => {
    const newInquiry = {
      id: Date.now(), ...data,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
    }
    setInquiries(prev => {
      const updated = [newInquiry, ...prev]
      save('fs_inquiries', updated)
      return updated
    })
  }

  return (
    <StudioContext.Provider value={{
      portfolio, setPortfolio,
      services, setServices,
      testimonials, setTestimonials,
      inquiries, setInquiries, addInquiry,
      heroPhotos, setHeroPhotos,
      galleryItems, setGalleryItems,
    }}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  return useContext(StudioContext)
}
