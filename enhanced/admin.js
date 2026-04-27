// ─── Admin Panel JavaScript ───────────────────────────────────────────────────
// Credentials
const ADMIN_USER = 'fsadmin';
const ADMIN_PASS = 'Studio@2026';

// ── Auth ──────────────────────────────────────────────────────────────────────
const loginScreen = document.getElementById('loginScreen');
const adminWrap   = document.getElementById('adminWrap');

function checkSession() {
  return sessionStorage.getItem('fs_admin') === 'true';
}

function login() {
  const u = document.getElementById('lgUser').value.trim();
  const p = document.getElementById('lgPass').value;
  const err = document.getElementById('loginError');
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem('fs_admin', 'true');
    loginScreen.setAttribute('hidden', '');
    adminWrap.removeAttribute('hidden');
    initAdmin();
    err.setAttribute('hidden','');
  } else {
    err.removeAttribute('hidden');
    document.getElementById('lgPass').value = '';
  }
}

document.getElementById('lgSubmit').addEventListener('click', login);
document.getElementById('lgUser').addEventListener('keydown', e => { if(e.key==='Enter') login(); });
document.getElementById('lgPass').addEventListener('keydown', e => { if(e.key==='Enter') login(); });

// ── Show / hide password toggle ───────────────────────────────────────────────
document.getElementById('lgEye').addEventListener('click', () => {
  const passEl = document.getElementById('lgPass');
  const icon   = document.getElementById('lgEyeIcon');
  if (passEl.type === 'password') {
    passEl.type = 'text';
    icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';
  } else {
    passEl.type = 'password';
    icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('fs_admin');
  location.reload();
});

if (checkSession()) {
  loginScreen.setAttribute('hidden','');
  adminWrap.removeAttribute('hidden');
  initAdmin();
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// ── Panel navigation ──────────────────────────────────────────────────────────
function initAdmin() {
  document.querySelectorAll('.snav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.snav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + btn.dataset.panel).classList.add('active');
    });
  });

  initHeroPanel();
  initPortfolioPanel();
  initDomGalleryPanel();
  initGalleryCatPanel();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeCard(item, onEdit, onDelete, nameKey='name', descKey='description') {
  const card = document.createElement('div');
  card.className = 'admin-card';
  card.innerHTML = `
    <img class="admin-card-img" src="${item.src}" alt="${item[nameKey] || item.alt || ''}">
    <div class="admin-card-body">
      <div class="admin-card-name">${item[nameKey] || item.alt || '(untitled)'}</div>
      <div class="admin-card-desc">${item[descKey] || ''}</div>
      <div class="admin-card-actions">
        <button class="card-btn-edit">Edit</button>
        <button class="card-btn-del">Delete</button>
      </div>
    </div>
  `;
  card.querySelector('.card-btn-edit').addEventListener('click', onEdit);
  card.querySelector('.card-btn-del').addEventListener('click', () => {
    if (confirm('Delete this photo?')) onDelete();
  });
  return card;
}

function livePreview(inputEl, previewEl) {
  inputEl.addEventListener('input', () => {
    const val = inputEl.value.trim();
    if (val) {
      previewEl.innerHTML = `<img src="${val}" alt="preview" onerror="this.style.display='none'" onload="this.style.display='block'">`;
    } else {
      previewEl.innerHTML = '';
    }
  });
}

// ── HERO PANEL ────────────────────────────────────────────────────────────────
function initHeroPanel() {
  const form    = document.getElementById('heroForm');
  const cards   = document.getElementById('heroCards');
  const srcEl   = document.getElementById('heroSrc');
  const altEl   = document.getElementById('heroAlt');
  const titleEl = document.getElementById('heroTitle');
  const subEl   = document.getElementById('heroSubtitle');
  const editId  = document.getElementById('heroEditId');
  const preview = document.getElementById('heroPreview');
  const formTitle = document.getElementById('heroFormTitle');

  livePreview(srcEl, preview);

  document.getElementById('heroAddBtn').addEventListener('click', () => {
    editId.value = ''; srcEl.value=''; altEl.value=''; titleEl.value=''; subEl.value='';
    preview.innerHTML=''; formTitle.textContent='New Hero Slide';
    form.removeAttribute('hidden');
    srcEl.focus();
  });
  document.getElementById('heroCancelBtn').addEventListener('click', () => form.setAttribute('hidden',''));

  document.getElementById('heroSaveBtn').addEventListener('click', () => {
    const src = srcEl.value.trim();
    if (!src) { showToast('Please enter an image URL.', 'error'); return; }
    const slides = DataStore.get('heroSlides');
    const id = editId.value;
    if (id) {
      const idx = slides.findIndex(s => s.id === id);
      if (idx !== -1) slides[idx] = { id, src, alt: altEl.value, title: titleEl.value, subtitle: subEl.value };
    } else {
      slides.push({ id: DataStore.generateId('s'), src, alt: altEl.value, title: titleEl.value, subtitle: subEl.value });
    }
    DataStore.set('heroSlides', slides);
    form.setAttribute('hidden','');
    renderHeroCards();
    showToast(id ? 'Slide updated!' : 'Slide added!');
  });

  renderHeroCards();
}

function renderHeroCards() {
  const cards = document.getElementById('heroCards');
  const slides = DataStore.get('heroSlides');
  cards.innerHTML = '';
  if (!slides.length) { cards.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem;">No slides yet.</p>'; return; }
  slides.forEach(slide => {
    const card = makeCard(slide,
      () => editHeroSlide(slide),
      () => { const s = DataStore.get('heroSlides').filter(x => x.id !== slide.id); DataStore.set('heroSlides', s); renderHeroCards(); showToast('Slide deleted.'); },
      'title', 'subtitle'
    );
    cards.appendChild(card);
  });
}

function editHeroSlide(slide) {
  document.getElementById('heroEditId').value = slide.id;
  document.getElementById('heroSrc').value = slide.src;
  document.getElementById('heroAlt').value = slide.alt;
  document.getElementById('heroTitle').value = slide.title;
  document.getElementById('heroSubtitle').value = slide.subtitle;
  document.getElementById('heroFormTitle').textContent = 'Edit Slide';
  document.getElementById('heroPreview').innerHTML = `<img src="${slide.src}" alt="">`;
  document.getElementById('heroForm').removeAttribute('hidden');
  document.getElementById('heroForm').scrollIntoView({behavior:'smooth'});
}

// ── PORTFOLIO PANEL ───────────────────────────────────────────────────────────
function initPortfolioPanel() {
  const form   = document.getElementById('portForm');
  const srcEl  = document.getElementById('portSrc');
  const nameEl = document.getElementById('portName');
  const descEl = document.getElementById('portDesc');
  const sizeEl = document.getElementById('portSize');
  const editId = document.getElementById('portEditId');
  const preview= document.getElementById('portPreview');
  const ftitle = document.getElementById('portFormTitle');

  livePreview(srcEl, preview);

  document.getElementById('portAddBtn').addEventListener('click', () => {
    editId.value=''; srcEl.value=''; nameEl.value=''; descEl.value=''; sizeEl.value='';
    preview.innerHTML=''; ftitle.textContent='New Portfolio Item';
    form.removeAttribute('hidden'); srcEl.focus();
  });
  document.getElementById('portCancelBtn').addEventListener('click', () => form.setAttribute('hidden',''));

  document.getElementById('portSaveBtn').addEventListener('click', () => {
    const src = srcEl.value.trim();
    if (!src) { showToast('Please enter an image URL.', 'error'); return; }
    const items = DataStore.get('portfolio');
    const id = editId.value;
    const obj = { id: id || DataStore.generateId('p'), src, name: nameEl.value, description: descEl.value, size: sizeEl.value };
    if (id) {
      const idx = items.findIndex(x => x.id === id);
      if (idx !== -1) items[idx] = obj;
    } else {
      items.push(obj);
    }
    DataStore.set('portfolio', items);
    form.setAttribute('hidden','');
    renderPortCards();
    showToast(id ? 'Photo updated!' : 'Photo added!');
  });

  renderPortCards();
}

function renderPortCards() {
  const cards = document.getElementById('portCards');
  const items = DataStore.get('portfolio');
  cards.innerHTML = '';
  if (!items.length) { cards.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem;">No items yet.</p>'; return; }
  items.forEach(item => {
    const card = makeCard(item,
      () => editPortItem(item),
      () => { const r = DataStore.get('portfolio').filter(x => x.id !== item.id); DataStore.set('portfolio', r); renderPortCards(); showToast('Photo deleted.'); },
      'name', 'description'
    );
    cards.appendChild(card);
  });
}

function editPortItem(item) {
  document.getElementById('portEditId').value = item.id;
  document.getElementById('portSrc').value = item.src;
  document.getElementById('portName').value = item.name;
  document.getElementById('portDesc').value = item.description;
  document.getElementById('portSize').value = item.size;
  document.getElementById('portFormTitle').textContent = 'Edit Portfolio Item';
  document.getElementById('portPreview').innerHTML = `<img src="${item.src}" alt="">`;
  document.getElementById('portForm').removeAttribute('hidden');
  document.getElementById('portForm').scrollIntoView({behavior:'smooth'});
}

// ── DOM GALLERY PANEL ─────────────────────────────────────────────────────────
function initDomGalleryPanel() {
  const form   = document.getElementById('dgForm');
  const srcEl  = document.getElementById('dgSrc');
  const altEl  = document.getElementById('dgAlt');
  const editId = document.getElementById('dgEditId');
  const preview= document.getElementById('dgPreview');
  const ftitle = document.getElementById('dgFormTitle');

  livePreview(srcEl, preview);

  document.getElementById('dgAddBtn').addEventListener('click', () => {
    editId.value=''; srcEl.value=''; altEl.value='';
    preview.innerHTML=''; ftitle.textContent='New DOM Gallery Photo';
    form.removeAttribute('hidden'); srcEl.focus();
  });
  document.getElementById('dgCancelBtn').addEventListener('click', () => form.setAttribute('hidden',''));

  document.getElementById('dgSaveBtn').addEventListener('click', () => {
    const src = srcEl.value.trim();
    if (!src) { showToast('Please enter an image URL.', 'error'); return; }
    const items = DataStore.get('domGallery');
    const id = editId.value;
    const obj = { id: id || DataStore.generateId('dg'), src, alt: altEl.value };
    if (id) {
      const idx = items.findIndex(x => x.id === id);
      if (idx !== -1) items[idx] = obj;
    } else {
      items.push(obj);
    }
    DataStore.set('domGallery', items);
    form.setAttribute('hidden','');
    renderDgCards();
    showToast(id ? 'Photo updated!' : 'Photo added!');
  });

  renderDgCards();
}

function renderDgCards() {
  const cards = document.getElementById('dgCards');
  const items = DataStore.get('domGallery');
  cards.innerHTML = '';
  if (!items.length) { cards.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem;">No photos yet.</p>'; return; }
  items.forEach(item => {
    const card = makeCard(item,
      () => editDgItem(item),
      () => { const r = DataStore.get('domGallery').filter(x => x.id !== item.id); DataStore.set('domGallery', r); renderDgCards(); showToast('Photo deleted.'); },
      'alt', 'alt'
    );
    cards.appendChild(card);
  });
}

function editDgItem(item) {
  document.getElementById('dgEditId').value = item.id;
  document.getElementById('dgSrc').value = item.src;
  document.getElementById('dgAlt').value = item.alt;
  document.getElementById('dgFormTitle').textContent = 'Edit DOM Gallery Photo';
  document.getElementById('dgPreview').innerHTML = `<img src="${item.src}" alt="">`;
  document.getElementById('dgForm').removeAttribute('hidden');
  document.getElementById('dgForm').scrollIntoView({behavior:'smooth'});
}

// ── GALLERY CATEGORIES PANEL ──────────────────────────────────────────────────
let activeCatId = null;

function initGalleryCatPanel() {
  renderGcatList();

  document.getElementById('gcatBack').addEventListener('click', () => {
    document.getElementById('gcatPhotosPanel').setAttribute('hidden','');
    document.getElementById('gcatList').style.display = '';
    activeCatId = null;
  });

  document.getElementById('gcatAddPhotoBtn').addEventListener('click', () => {
    const form = document.getElementById('gcatPhotoForm');
    document.getElementById('gcatPhotoEditId').value = '';
    document.getElementById('gcatPhotoSrc').value = '';
    document.getElementById('gcatPhotoName').value = '';
    document.getElementById('gcatPhotoDesc').value = '';
    document.getElementById('gcatPhotoPreview').innerHTML = '';
    document.getElementById('gcatPhotoFormTitle').textContent = 'New Photo';
    form.removeAttribute('hidden');
    document.getElementById('gcatPhotoSrc').focus();
  });

  document.getElementById('gcatPhotoCancelBtn').addEventListener('click', () => {
    document.getElementById('gcatPhotoForm').setAttribute('hidden','');
  });

  livePreview(document.getElementById('gcatPhotoSrc'), document.getElementById('gcatPhotoPreview'));

  document.getElementById('gcatPhotoSaveBtn').addEventListener('click', () => {
    const src = document.getElementById('gcatPhotoSrc').value.trim();
    if (!src) { showToast('Please enter an image URL.', 'error'); return; }
    const cats = DataStore.get('galleryCategories');
    const cat  = cats.find(c => c.id === activeCatId);
    if (!cat) return;
    const id = document.getElementById('gcatPhotoEditId').value;
    const obj = {
      id: id || DataStore.generateId('gp'),
      src,
      name: document.getElementById('gcatPhotoName').value,
      description: document.getElementById('gcatPhotoDesc').value,
    };
    if (id) {
      const idx = cat.photos.findIndex(p => p.id === id);
      if (idx !== -1) cat.photos[idx] = obj;
    } else {
      cat.photos.push(obj);
    }
    DataStore.set('galleryCategories', cats);
    document.getElementById('gcatPhotoForm').setAttribute('hidden','');
    renderCatPhotos(activeCatId);
    showToast(id ? 'Photo updated!' : 'Photo added!');
  });
}

function renderGcatList() {
  const list = document.getElementById('gcatList');
  const cats = DataStore.get('galleryCategories');
  list.innerHTML = '';
  const icons = ['💍','💑','👶','💎','🥂','🌸','📸','🎬','✨','🌺'];
  cats.forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'gcat-card';
    card.innerHTML = `
      <div class="gcat-card-icon">${icons[i % icons.length]}</div>
      <div class="gcat-card-name">${cat.name}</div>
      <div class="gcat-card-count">${cat.photos.length} photo${cat.photos.length!==1?'s':''}</div>
      <span class="gcat-card-arrow">›</span>
    `;
    card.addEventListener('click', () => openCatPanel(cat.id));
    list.appendChild(card);
  });
}

function openCatPanel(catId) {
  activeCatId = catId;
  const cats = DataStore.get('galleryCategories');
  const cat  = cats.find(c => c.id === catId);
  document.getElementById('gcatPhotoTitle').textContent = cat.name;
  document.getElementById('gcatList').style.display = 'none';
  document.getElementById('gcatPhotosPanel').removeAttribute('hidden');
  document.getElementById('gcatPhotoForm').setAttribute('hidden','');
  renderCatPhotos(catId);
}

function renderCatPhotos(catId) {
  const grid = document.getElementById('gcatPhotosGrid');
  const cats = DataStore.get('galleryCategories');
  const cat  = cats.find(c => c.id === catId);
  // Update count in list
  renderGcatList();
  if (!cat) return;
  grid.innerHTML = '';
  if (!cat.photos.length) {
    grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem;">No photos in this category yet.</p>';
    return;
  }
  cat.photos.forEach(photo => {
    const card = makeCard(photo,
      () => editCatPhoto(catId, photo),
      () => {
        const cs = DataStore.get('galleryCategories');
        const ct = cs.find(c => c.id === catId);
        if (ct) ct.photos = ct.photos.filter(p => p.id !== photo.id);
        DataStore.set('galleryCategories', cs);
        renderCatPhotos(catId);
        showToast('Photo deleted.');
      },
      'name', 'description'
    );
    grid.appendChild(card);
  });
}

function editCatPhoto(catId, photo) {
  document.getElementById('gcatPhotoEditId').value = photo.id;
  document.getElementById('gcatPhotoSrc').value = photo.src;
  document.getElementById('gcatPhotoName').value = photo.name;
  document.getElementById('gcatPhotoDesc').value = photo.description;
  document.getElementById('gcatPhotoFormTitle').textContent = 'Edit Photo';
  document.getElementById('gcatPhotoPreview').innerHTML = `<img src="${photo.src}" alt="">`;
  document.getElementById('gcatPhotoForm').removeAttribute('hidden');
  document.getElementById('gcatPhotoForm').scrollIntoView({behavior:'smooth'});
}
