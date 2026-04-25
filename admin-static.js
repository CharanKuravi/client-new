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

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    loadImages();
    loadFeaturedImages();
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
            'portfolio': 'Portfolio Images',
            'featured': 'Featured Work',
            'hero': 'Hero Section',
            'settings': 'Settings'
        };
        document.getElementById('section-title').textContent = titles[section];
    });
});

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
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/') && images.length < 3) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    url: e.target.result,
                    name: file.name,
                    date: new Date().toLocaleDateString()
                };
                images.push(newImage);
                saveFeaturedImages(images);
                loadFeaturedImages();
            };
            reader.readAsDataURL(file);
        }
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

// Upload Button in Header
document.getElementById('upload-btn').addEventListener('click', () => {
    fileInput.click();
});

// Initialize
checkAuth();
