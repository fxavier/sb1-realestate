import { Request, Response } from 'express';
import Review from '../models/Review';
import Property from '../models/Property';

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const userId = req.user?._id;

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({ property: propertyId, user: userId });
    if (existingReview) {
      res.status(400).json({ message: 'You have already reviewed this property' });
      return;
    }

    const review = await Review.create({
      ...req.body,
      property: propertyId,
      user: userId,
    });

    await review.populate([
      { path: 'user', select: 'name' },
      { path: 'property', select: 'title' }
    ]);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPropertyReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = req.query.sort || '-createdAt';

    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'name')
      .sort(sort as string)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ property: propertyId });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      res.status(404).json({ message: 'Review not found or not authorized' });
      return;
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    ).populate('user', 'name');

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      res.status(404).json({ message: 'Review not found or not authorized' });
      return;
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleReviewLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    const likeIndex = review.likes.indexOf(userId);
    if (likeIndex === -1) {
      review.likes.push(userId);
    } else {
      review.likes.splice(likeIndex, 1);
    }

    await review.save();
    res.json({ likes: review.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const reviews = await Review.find({ user: userId })
      .populate('property', 'title images')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ user: userId });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};