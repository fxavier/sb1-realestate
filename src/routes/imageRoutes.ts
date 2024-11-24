import express from 'express';
import { upload } from '../middleware/upload';
import { 
  uploadPropertyImages, 
  deletePropertyImage,
  getUploadUrl 
} from '../controllers/imageController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post(
  '/upload',
  protect,
  authorize('agent', 'admin'),
  upload.array('images', 10),
  uploadPropertyImages
);

router.delete(
  '/:key',
  protect,
  authorize('agent', 'admin'),
  deletePropertyImage
);

router.get(
  '/presigned-url/:filename',
  protect,
  authorize('agent', 'admin'),
  getUploadUrl
);

export default router;