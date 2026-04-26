// Static Admin Panel - No Backend Required
// All data stored in localStorage

// Hardcoded credentials
const ADMIN_EMAIL = 'admin@fashionstudio.com';
const ADMIN_PASSWORD = 'FashionStudio@2026';

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

// Login Form Handler
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
});

// Logout Handler
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        location.reload();
    }
});

// Bug fix #4: call updateDashboardStats on initial load
function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    loadImages();
    loadFeaturedImages();
    updateDashboardStats();
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const section = item.dataset.section;
        document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
        document.getElementById(`${section}-section`).style.display = 'block';
        
        const titles = {
            'dashboard': 'Dashboard',
            'portfolio': 'Gallery Management',
            'featured': 'Featured Work',
            'hero': 'Hero Section',
            'inquiries': 'Inquiries Management',
            'settings': 'Site Settings'
        };
        document.getElementById('section-title').textContent = titles[section];
        
        // Update stats on dashboard view
        if (section === 'dashboard') {
            updateDashboardStats();
        }
    });
});

// Update dashboard stats
function updateDashboardStats() {
    const images = getImages();
    const featured = getFeaturedImages();
    const inquiries = getInquiries();
    const newCount = inquiries.filter(i => i.status === 'new').length;
    document.getElementById('total-photos').textContent = images.length;
    document.getElementById('featured-count').textContent = featured.length;
    document.getElementById('inquiries-count').textContent = inquiries.length;
    // Show badge on sidebar if there are new inquiries
    const inquiriesNavItem = document.querySelector('[data-section="inquiries"]');
    if (inquiriesNavItem) {
        let badge = inquiriesNavItem.querySelector('.inquiry-badge');
        if (newCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'inquiry-badge';
                inquiriesNavItem.appendChild(badge);
            }
            badge.textContent = newCount;
        } else if (badge) {
            badge.remove();
        }
    }
}

// Image Storage (localStorage)
function getImages() {
    const images = localStorage.getItem('portfolioImages');
    return images ? JSON.parse(images) : [];
}

function saveImages(images) {
    localStorage.setItem('portfolioImages', JSON.stringify(images));
}

function getFeaturedImages() {
    const images = localStorage.getItem('featuredImages');
    return images ? JSON.parse(images) : [];
}

function saveFeaturedImages(images) {
    localStorage.setItem('featuredImages', JSON.stringify(images));
}

// Load and Display Images
function loadImages() {
    const images = getImages();
    const grid = document.getElementById('images-grid');
    grid.innerHTML = '';
    
    images.forEach((image, index) => {
        const card = createImageCard(image, index);
        grid.appendChild(card);
    });
}

function loadFeaturedImages() {
    const images = getFeaturedImages();
    const grid = document.getElementById('featured-images-grid');
    grid.innerHTML = '';
    
    images.forEach((image, index) => {
        const card = createImageCard(image, index, true);
        grid.appendChild(card);
    });
}

function createImageCard(image, index, isFeatured = false) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
        <img src="${image.url}" alt="${image.name}">
        <div class="image-card-info">
            <h4>${image.name}</h4>
            <p>Uploaded: ${image.date}</p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        showImageModal(image, index, isFeatured);
    });
    
    return card;
}

// Upload Zone - Portfolio
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Upload Zone - Featured
const featuredUploadZone = document.getElementById('featured-upload-zone');
const featuredFileInput = document.getElementById('featured-file-input');

featuredUploadZone.addEventListener('click', () => featuredFileInput.click());

featuredUploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    featuredUploadZone.classList.add('dragover');
});

featuredUploadZone.addEventListener('dragleave', () => {
    featuredUploadZone.classList.remove('dragover');
});

featuredUploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    featuredUploadZone.classList.remove('dragover');
    handleFeaturedFiles(e.dataTransfer.files);
});

featuredFileInput.addEventListener('change', (e) => {
    handleFeaturedFiles(e.target.files);
});

// Handle File Upload
function handleFiles(files) {
    const images = getImages();
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    url: e.target.result,
                    name: file.name,
                    date: new Date().toLocaleDateString()
                };
                images.push(newImage);
                saveImages(images);
                loadImages();
            };
            reader.readAsDataURL(file);
        }
    });
}

function handleFeaturedFiles(files) {
    const images = getFeaturedImages();

    if (images.length >= 3) {
        alert('Maximum 3 featured images allowed!');
        return;
    }

    // Determine how many slots remain and slice files to avoid exceeding limit
    const remaining = 3 - images.length;
    const filesToProcess = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, remaining);

    if (filesToProcess.length === 0) return;

    let loaded = 0;
    filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            images.push({
                url: e.target.result,
                name: file.name,
                date: new Date().toLocaleDateString()
            });
            loaded++;
            if (loaded === filesToProcess.length) {
                saveFeaturedImages(images);
                loadFeaturedImages();
            }
        };
        reader.readAsDataURL(file);
    });
}

// Image Modal
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.querySelector('.modal-close');
let currentImageIndex = null;
let currentIsFeatured = false;

function showImageModal(image, index, isFeatured = false) {
    modal.style.display = 'block';
    modalImage.src = image.url;
    currentImageIndex = index;
    currentIsFeatured = isFeatured;
}

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Delete Image
document.getElementById('delete-image').addEventListener('click', () => {
    if (currentImageIndex !== null) {
        if (confirm('Are you sure you want to delete this image?')) {
            if (currentIsFeatured) {
                const images = getFeaturedImages();
                images.splice(currentImageIndex, 1);
                saveFeaturedImages(images);
                loadFeaturedImages();
            } else {
                const images = getImages();
                images.splice(currentImageIndex, 1);
                saveImages(images);
                loadImages();
            }
            modal.style.display = 'none';
        }
    }
});

// Hero Section
document.getElementById('save-hero-text').addEventListener('click', () => {
    const heroData = {
        subtitle: document.getElementById('hero-subtitle').value,
        title: document.getElementById('hero-title').value,
        description: document.getElementById('hero-description').value
    };
    localStorage.setItem('heroText', JSON.stringify(heroData));
    alert('Hero text updated!');
});

// Save Settings
document.getElementById('save-settings').addEventListener('click', () => {
    const settings = {
        studioName: document.getElementById('studio-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value
    };
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
});

// Upload Button in Header — opens the correct uploader based on active section
document.getElementById('upload-btn').addEventListener('click', () => {
    const featuredSection = document.getElementById('featured-section');
    if (featuredSection && featuredSection.style.display !== 'none') {
        featuredFileInput.click();
    } else {
        fileInput.click();
    }
});

// ─── Inquiries ────────────────────────────────────────────────────────────────

function getInquiries() {
    const data = localStorage.getItem('contactInquiries');
    return data ? JSON.parse(data) : [];
}

function saveInquiries(inquiries) {
    localStorage.setItem('contactInquiries', JSON.stringify(inquiries));
}

function loadInquiries(filter = 'all') {
    let inquiries = getInquiries();
    if (filter !== 'all') {
        inquiries = inquiries.filter(i => i.status === filter);
    }

    const tbody = document.getElementById('inquiries-tbody');
    const noMsg = document.getElementById('no-inquiries-msg');
    tbody.innerHTML = '';

    if (inquiries.length === 0) {
        noMsg.style.display = 'block';
        return;
    }
    noMsg.style.display = 'none';

    // Show newest first
    [...inquiries].reverse().forEach((inq) => {
        const tr = document.createElement('tr');
        tr.style.fontWeight = inq.status === 'new' ? '600' : 'normal';
        tr.innerHTML = `
            <td>${escapeHtml(inq.name)}</td>
            <td><a href="mailto:${escapeHtml(inq.email)}" style="color:#8B6F47;">${escapeHtml(inq.email)}</a></td>
            <td>${escapeHtml(inq.phone || '—')}</td>
            <td>${escapeHtml(inq.service || '—')}</td>
            <td style="max-width:220px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(inq.message)}">${escapeHtml(inq.message)}</td>
            <td style="white-space:nowrap;">${inq.date}</td>
            <td>
                <span class="inquiry-status-badge ${inq.status === 'new' ? 'badge-new' : 'badge-read'}">
                    ${inq.status === 'new' ? '🔵 New' : '✓ Read'}
                </span>
            </td>
            <td style="white-space:nowrap;">
                ${inq.status === 'new' ? `<button class="btn-mark-read" data-id="${inq.id}" style="margin-right:6px;">Mark Read</button>` : ''}
                <button class="btn-delete-inquiry" data-id="${inq.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Mark as read
    tbody.querySelectorAll('.btn-mark-read').forEach(btn => {
        btn.addEventListener('click', () => {
            const all = getInquiries();
            const item = all.find(i => i.id === btn.dataset.id);
            if (item) {
                item.status = 'read';
                saveInquiries(all);
                loadInquiries(document.getElementById('inquiry-filter').value);
                updateDashboardStats();
            }
        });
    });

    // Delete inquiry
    tbody.querySelectorAll('.btn-delete-inquiry').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this inquiry?')) {
                const all = getInquiries().filter(i => i.id !== btn.dataset.id);
                saveInquiries(all);
                loadInquiries(document.getElementById('inquiry-filter').value);
                updateDashboardStats();
            }
        });
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Filter change
document.getElementById('inquiry-filter').addEventListener('change', (e) => {
    loadInquiries(e.target.value);
});

// Clear all inquiries
document.getElementById('clear-inquiries-btn').addEventListener('click', () => {
    if (confirm('Delete ALL inquiries? This cannot be undone.')) {
        saveInquiries([]);
        loadInquiries();
        updateDashboardStats();
    }
});

// Load inquiries when navigating to that section
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (item.dataset.section === 'inquiries') {
            loadInquiries(document.getElementById('inquiry-filter').value);
        }
    });
});

// Initialize
checkAuth();
