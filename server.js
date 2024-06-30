const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
// Use CORS and set the Access-Control-Allow-Origin header
app.use(cors({ origin: 'http://localhost:3000' }));
// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')  // make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Serve static files from 'public' directory
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/target', express.static(path.join(__dirname, 'target')));


// File upload endpoint
app.post('/upload', upload.single('model'), (req, res) => {
    if (req.file) {
        console.log('Uploaded:', req.file.path);
        res.json({ success: true, modelId: req.file.filename }); // Send back success status and file name as model ID
    } else {
        res.status(400).send('No file uploaded.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
