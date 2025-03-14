import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename :function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('On peut seulement upload des images !'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

const uploadMultiple = multer({
    storage: storage,
   fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
        files: 5
    }
});

export { upload, uploadMultiple };