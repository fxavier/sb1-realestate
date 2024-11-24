import express from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  toggleFavorite,
  toggleWishlist,
  getFavorites,
  getWishlist,
  syncLocalStorage,
} from '../controllers/propertyController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('agent', 'admin'), upload.array('images', 10), createProperty);

router.get('/my-properties', protect, getMyProperties);
router.get('/favorites', protect, getFavorites);
router.get('/wishlist', protect, getWishlist);
router.post('/sync', protect, syncLocalStorage);

router.route('/:id')
  .get(getProperty)
  .put(protect, authorize('agent', 'admin'), upload.array('images', 10), updateProperty)
  .delete(protect, authorize('agent', 'admin'), deleteProperty);

router.route('/:id/favorite')
  .post(protect, toggleFavorite);

router.route('/:id/wishlist')
  .post(protect, toggleWishlist);

export default router;