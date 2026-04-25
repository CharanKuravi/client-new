# Fashion Studio - Premium Photography Website

A stunning, professional photography website with a complete admin panel for managing images and content.

## Features

### Frontend
- 🎨 Premium glassmorphism design (iPhone-style)
- 📸 3D rotating camera with Three.js
- 🎭 Smooth scroll animations
- 📱 Fully responsive design
- ✨ Portfolio gallery with real images
- 💼 Professional services section
- 📧 Contact form

### Admin Panel
- 🔐 Secure login system
- 📤 Drag & drop image upload
- 🖼️ Portfolio image management
- ⭐ Featured work section
- 🎨 Hero section customization
- ⚙️ Site settings management
- 🗑️ Delete images functionality

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

3. **Access the website:**
- Main Website: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## Admin Login

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

## Usage

### Uploading Images
1. Login to admin panel
2. Navigate to "Portfolio Images" or "Featured Work"
3. Drag & drop images or click to browse
4. Images are automatically saved

### Customizing Hero Section
1. Go to "Hero Section" in admin
2. Upload new background image
3. Edit text content (subtitle, title, description)
4. Click "Save Changes"

### Managing Settings
1. Navigate to "Settings"
2. Update studio name, email, phone
3. Change admin password
4. Save settings

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, Three.js
- **Backend:** Node.js, Express
- **File Upload:** Multer
- **Storage:** LocalStorage (demo) / File System

## File Structure

```
fashion-studio/
├── index.html              # Main website
├── styles.css              # Main styles
├── script.js               # Main JavaScript
├── admin.html              # Admin panel
├── admin-styles.css        # Admin styles
├── admin-script.js         # Admin JavaScript
├── server.js               # Backend server
├── package.json            # Dependencies
├── uploads/                # Uploaded images
└── README.md              # Documentation
```

## Deployment

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
1. Connect your GitHub repo
2. Set build command: `npm install`
3. Set publish directory: `.`

## Security Notes

⚠️ **Important:** This demo uses simple authentication. For production:
- Implement proper user authentication (JWT, OAuth)
- Use a real database (MongoDB, PostgreSQL)
- Add HTTPS/SSL
- Implement rate limiting
- Add CSRF protection
- Use environment variables for secrets

## License

MIT License - Feel free to use for personal or commercial projects!

## Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for Fashion Studio
