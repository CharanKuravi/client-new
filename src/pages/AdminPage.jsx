import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudio, fileToBase64 } from '../context/StudioContext'
import './AdminPage.css'

const CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USER,
  password: import.meta.env.VITE_ADMIN_PASS,
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('inquiries')

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginData.username === CREDENTIALS.username && loginData.password === CREDENTIALS.password) {
      setLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials. Try again.')
    }
  }

  if (!loggedIn) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <div className="traffic-lights">
              <span className="light red"></span>
              <span className="light yellow"></span>
              <span className="light green"></span>
            </div>
          </div>
          <div className="admin-login-body">
            <h1>FASHION STUDIO</h1>
            <p className="admin-login-sub">Admin Panel</p>
            <form onSubmit={handleLogin}>
              <div className="admin-form-group">
                <input type="text" placeholder="Username" value={loginData.username}
                  onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))} required />
              </div>
              <div className="admin-form-group">
                <input type="password" placeholder="Password" value={loginData.password}
                  onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))} required />
              </div>
              {loginError && <p className="admin-error">{loginError}</p>}
              <button type="submit" className="admin-login-btn">LOGIN</button>
            </form>
            <Link to="/" className="admin-back-link">← Back to Site</Link>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'inquiries',    label: '📬 Inquiries' },
    { id: 'portfolio',    label: '📸 Portfolio' },
    { id: 'hero',         label: '🖼️ Hero Photos' },
    { id: 'gallery',      label: '🎠 Gallery' },
    { id: 'services',     label: '✨ Services' },
    { id: 'testimonials', label: '💬 Testimonials' },
  ]

  const titles = {
    inquiries:    'Contact Inquiries',
    portfolio:    'Portfolio Management',
    hero:         'Hero Polaroid Photos',
    gallery:      'Circular Gallery',
    services:     'Services Management',
    testimonials: 'Testimonials',
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>FS Admin</h2>
          <span>Fashion Studio</span>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            <button key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={() => setLoggedIn(false)}>Logout</button>
          <Link to="/" className="admin-view-site">View Site →</Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">{titles[activeTab]}</h1>
          <div className="admin-user-badge">👤 fsadmin</div>
        </div>
        <div className="admin-content">
          {activeTab === 'inquiries'    && <InquiriesPanel />}
          {activeTab === 'portfolio'    && <PortfolioPanel />}
          {activeTab === 'hero'         && <HeroPhotosPanel />}
          {activeTab === 'gallery'      && <GalleryPanel />}
          {activeTab === 'services'     && <ServicesPanel />}
          {activeTab === 'testimonials' && <TestimonialsPanel />}
        </div>
      </main>
    </div>
  )
}

/* ─── INQUIRIES ─── */
function InquiriesPanel() {
  const { inquiries, setInquiries } = useStudio()

  const updateStatus = (id, status) => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i))
  }

  const deleteInquiry = (id) => {
    setInquiries(inquiries.filter(i => i.id !== id))
  }

  if (inquiries.length === 0) {
    return (
      <div className="admin-panel">
        <div className="admin-empty">
          <p>📭 No inquiries yet.</p>
          <span>When someone submits the contact form, it will appear here.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}</span>
        <span className="admin-hint">New inquiries come from the contact form on the site</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(i => (
              <tr key={i.id}>
                <td><strong>{i.name}</strong></td>
                <td>{i.email}</td>
                <td>{i.phone || '—'}</td>
                <td>{i.service}</td>
                <td className="msg-cell" title={i.message}>{i.message?.slice(0, 40)}{i.message?.length > 40 ? '…' : ''}</td>
                <td>{i.date}</td>
                <td>
                  <select
                    className={`status-select ${i.status === 'New' ? 'new' : i.status === 'Replied' ? 'replied' : 'closed'}`}
                    value={i.status}
                    onChange={e => updateStatus(i.id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>
                  <button className="admin-delete-btn-inline" onClick={() => deleteInquiry(i.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── PORTFOLIO ─── */
function PortfolioPanel() {
  const { portfolio, setPortfolio } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', category: '', url: '', tall: false, wide: false })
  const [uploading, setUploading] = useState(false)

  const openAdd = () => { setForm({ title: '', category: '', url: '', tall: false, wide: false }); setEditing(null); setAdding(true) }
  const openEdit = (item) => { setForm({ title: item.title, category: item.category, url: item.url, tall: !!item.tall, wide: !!item.wide }); setEditing(item.id); setAdding(true) }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const base64 = await fileToBase64(file)
      setForm(prev => ({ ...prev, url: base64 }))
    } catch { alert('Failed to read file') }
    setUploading(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setPortfolio(portfolio.map(p => p.id === editing ? { ...p, ...form } : p))
    } else {
      setPortfolio([...portfolio, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{portfolio.length} items</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Item</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <input placeholder="Category (e.g. Wedding)" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required />
          <div className="upload-section">
            <label className="upload-label">
              <span>📁 Upload from device</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <span className="upload-or">or</span>
            <input
              placeholder="Paste image URL"
              value={form.url.startsWith('data:') ? '(uploaded file)' : form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              style={{ flex: 1 }}
            />
          </div>
          <div className="form-checks">
            <label><input type="checkbox" checked={form.tall} onChange={e => setForm(p => ({ ...p, tall: e.target.checked, wide: false }))} /> Tall</label>
            <label><input type="checkbox" checked={form.wide} onChange={e => setForm(p => ({ ...p, wide: e.target.checked, tall: false }))} /> Wide</label>
          </div>
          {form.url && (
            <div className="upload-preview">
              <img src={form.url} alt="preview" onError={e => e.target.style.display='none'} />
            </div>
          )}
          {uploading && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Processing image...</p>}
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={uploading}>{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-grid">
        {portfolio.map(item => (
          <div key={item.id} className="admin-card">
            <img src={item.url} alt={item.title} onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }} />
            <div className="admin-card-info">
              <h4>{item.title}</h4>
              <span className="admin-badge">{item.category}</span>
              {item.tall && <span className="admin-badge" style={{marginLeft:4}}>Tall</span>}
              {item.wide && <span className="admin-badge" style={{marginLeft:4}}>Wide</span>}
            </div>
            <div className="admin-card-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(item)}>✏️</button>
              <button className="admin-delete-btn" onClick={() => setPortfolio(portfolio.filter(p => p.id !== item.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── SERVICES ─── */
function ServicesPanel() {
  const { services, setServices } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ icon: '', title: '', description: '' })

  const openAdd = () => { setForm({ icon: '', title: '', description: '' }); setEditing(null); setAdding(true) }
  const openEdit = (s) => { setForm({ icon: s.icon, title: s.title, description: s.description }); setEditing(s.id); setAdding(true) }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setServices(services.map(s => s.id === editing ? { ...s, ...form } : s))
    } else {
      setServices([...services, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{services.length} services</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Service</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <input placeholder="Icon label (e.g. 05)" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} required />
          <input placeholder="Service Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows="3" required style={{ width:'100%', padding:'10px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'8px', color:'#fff', fontFamily:'inherit', resize:'vertical' }} />
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn">{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-list">
        {services.map(s => (
          <div key={s.id} className="admin-list-item">
            <div className="admin-list-icon">{s.icon}</div>
            <div className="admin-list-body">
              <h4>{s.title}</h4>
              <p>{s.description}</p>
            </div>
            <div className="admin-list-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(s)}>✏️</button>
              <button className="admin-delete-btn-inline" onClick={() => setServices(services.filter(x => x.id !== s.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── TESTIMONIALS ─── */
function TestimonialsPanel() {
  const { testimonials, setTestimonials } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ author: '', role: '', text: '' })

  const openAdd = () => { setForm({ author: '', role: '', text: '' }); setEditing(null); setAdding(true) }
  const openEdit = (t) => { setForm({ author: t.author, role: t.role, text: t.text }); setEditing(t.id); setAdding(true) }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setTestimonials(testimonials.map(t => t.id === editing ? { ...t, ...form } : t))
    } else {
      setTestimonials([...testimonials, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{testimonials.length} testimonials</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Testimonial</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <input placeholder="Client Name" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} required />
          <input placeholder="Role / Company" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required />
          <textarea placeholder="Testimonial text" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows="3" required style={{ width:'100%', padding:'10px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'8px', color:'#fff', fontFamily:'inherit', resize:'vertical' }} />
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn">{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-list">
        {testimonials.map(t => (
          <div key={t.id} className="admin-list-item">
            <div className="admin-list-body">
              <h4>{t.author} <small>— {t.role}</small></h4>
              <p>"{t.text}"</p>
            </div>
            <div className="admin-list-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(t)}>✏️</button>
              <button className="admin-delete-btn-inline" onClick={() => setTestimonials(testimonials.filter(x => x.id !== t.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── HERO PHOTOS ─── */
function HeroPhotosPanel() {
  const { heroPhotos, setHeroPhotos } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ url: '', alt: '', rotate: '0deg' })
  const [uploading, setUploading] = useState(false)

  const ROTATIONS = ['0deg', '3deg', '-4deg', '2deg', '-3deg', '4deg', '-2deg', '5deg', '-5deg']

  const openAdd = () => { setForm({ url: '', alt: '', rotate: '3deg' }); setEditing(null); setAdding(true) }
  const openEdit = (p) => { setForm({ url: p.url, alt: p.alt, rotate: p.rotate }); setEditing(p.id); setAdding(true) }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const base64 = await fileToBase64(file)
      setForm(prev => ({ ...prev, url: base64 }))
    } catch (err) {
      alert('Failed to read file')
    }
    setUploading(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setHeroPhotos(heroPhotos.map(p => p.id === editing ? { ...p, ...form } : p))
    } else {
      setHeroPhotos([...heroPhotos, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{heroPhotos.length} polaroid photos (shown on hero section)</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Photo</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <div className="upload-section">
            <label className="upload-label">
              <span>📁 Upload from device</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <span className="upload-or">or</span>
            <input
              placeholder="Paste image URL"
              value={form.url.startsWith('data:') ? '(uploaded file)' : form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              style={{ flex: 1 }}
            />
          </div>
          <input placeholder="Alt text (e.g. Fashion Photo)" value={form.alt} onChange={e => setForm(p => ({ ...p, alt: e.target.value }))} required />
          <select value={form.rotate} onChange={e => setForm(p => ({ ...p, rotate: e.target.value }))}
            style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit' }}>
            {ROTATIONS.map(r => <option key={r} value={r}>{r} rotation</option>)}
          </select>
          {form.url && (
            <div className="upload-preview">
              <img src={form.url} alt="preview" onError={e => e.target.style.display='none'} />
            </div>
          )}
          {uploading && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Processing image...</p>}
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={uploading}>{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-grid">
        {heroPhotos.map(photo => (
          <div key={photo.id} className="admin-card">
            <div className="polaroid-preview" style={{ transform: `rotate(${photo.rotate})` }}>
              <img src={photo.url} alt={photo.alt} onError={e => { e.target.src = 'https://via.placeholder.com/200?text=No+Image' }} />
            </div>
            <div className="admin-card-info">
              <h4>{photo.alt}</h4>
              <span className="admin-badge">{photo.rotate}</span>
            </div>
            <div className="admin-card-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(photo)}>✏️</button>
              <button className="admin-delete-btn" onClick={() => setHeroPhotos(heroPhotos.filter(p => p.id !== photo.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── GALLERY ─── */
function GalleryPanel() {
  const { galleryItems, setGalleryItems } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ url: '', text: '' })
  const [uploading, setUploading] = useState(false)

  const openAdd = () => { setForm({ url: '', text: '' }); setEditing(null); setAdding(true) }
  const openEdit = (g) => { setForm({ url: g.url, text: g.text }); setEditing(g.id); setAdding(true) }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const base64 = await fileToBase64(file)
      setForm(prev => ({ ...prev, url: base64 }))
    } catch {
      alert('Failed to read file')
    }
    setUploading(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setGalleryItems(galleryItems.map(g => g.id === editing ? { ...g, ...form } : g))
    } else {
      setGalleryItems([...galleryItems, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{galleryItems.length} gallery items (shown in circular gallery)</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Photo</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <div className="upload-section">
            <label className="upload-label">
              <span>📁 Upload from device</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <span className="upload-or">or</span>
            <input
              placeholder="Paste image URL"
              value={form.url.startsWith('data:') ? '(uploaded file)' : form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              style={{ flex: 1 }}
            />
          </div>
          <input placeholder="Label (e.g. Bridal Session)" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} required />
          {form.url && (
            <div className="upload-preview">
              <img src={form.url} alt="preview" onError={e => e.target.style.display='none'} />
            </div>
          )}
          {uploading && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Processing image...</p>}
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={uploading}>{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-grid">
        {galleryItems.map(item => (
          <div key={item.id} className="admin-card">
            <img src={item.url} alt={item.text} onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }} />
            <div className="admin-card-info">
              <h4>{item.text}</h4>
            </div>
            <div className="admin-card-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(item)}>✏️</button>
              <button className="admin-delete-btn" onClick={() => setGalleryItems(galleryItems.filter(g => g.id !== item.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
