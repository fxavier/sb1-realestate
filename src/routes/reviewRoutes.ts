import express from 'express';
import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
  toggleReviewLike,
  getUserReviews,
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Property-specific reviews
router.route('/property/:propertyId')
  .get(getPropertyReviews)
  .post(protect, createReview);

// User's reviews
router.get('/my-reviews', protect, getUserReviews);

// Individual review operations
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

// Like/unlike review
router.post('/:id/like', protect, toggleReviewLike);

export default router;