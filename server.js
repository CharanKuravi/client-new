const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Upload single image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
        success: true,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname
    });
});

// Upload multiple images
app.post('/api/upload-multiple', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const files = req.files.map(file => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        originalName: file.originalname
    }));
    
    res.json({
        success: true,
        files: files
    });
});

// Get all uploaded images
app.get('/api/images', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read uploads directory' });
        }
        
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => ({
                filename: file,
                url: `/uploads/${file}`
            }));
        
        res.json({ images });
    });
});

// Delete image
app.delete('/api/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    
    fs.unlink(filepath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to delete file' });
        }
        res.json({ success: true, message: 'File deleted successfully' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║   Fashion Studio Server Running! 🚀       ║
    ╠═══════════════════════════════════════════╣
    ║   Website:  http://localhost:${PORT}        ║
    ║   Admin:    http://localhost:${PORT}/admin  ║
    ╚═══════════════════════════════════════════╝
    `);
});
