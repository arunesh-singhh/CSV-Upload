import express from 'express';
import multer from 'multer';
import { home, view, upload } from '../controllers/controller.js';

const router = express.Router();

const uploads = multer({ dest: 'uploads/' })

router.get('/', home);
router.get('/csv/:id', view);
router.post('/upload', uploads.single('csv'), upload);

export default router;