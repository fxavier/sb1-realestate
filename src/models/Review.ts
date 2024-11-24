import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  property: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  likes: mongoose.Types.ObjectId[];
  isVerifiedStay: boolean;
  images?: string[];
}

const reviewSchema = new Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  isVerifiedStay: {
    type: Boolean,
    default: false,
  },
  images: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Add compound index to prevent multiple reviews from same user on same property
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', reviewSchema);