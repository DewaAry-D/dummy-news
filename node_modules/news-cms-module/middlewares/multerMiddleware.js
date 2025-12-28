const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = 'public/newspicture/';
        
        if (file.fieldname === 'thumbnailImage') {
        dest += 'thumbnail';
        } else if (file.fieldname === 'contentImages') {
        dest += 'contentnews';
        }

        if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
        }

        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isExtensionValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isMimeValid = allowedTypes.test(file.mimetype);

    if (isExtensionValid && isMimeValid) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung! Gunakan jpg/jpeg/png.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 }
});

module.exports = upload;