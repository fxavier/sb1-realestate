import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: mongoose.Types.ObjectId;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'house' | 'apartment' | 'condo';
  status: 'for-sale' | 'for-rent';
  owner: mongoose.Types.ObjectId;
  images: string[];
  details: {
    yearBuilt?: number;
    parking?: number;
    furnished: boolean;
    petFriendly: boolean;
    garden: boolean;
    swimmingPool: boolean;
    airConditioning: boolean;
    heating: boolean;
  };
  amenities: string[];
  views: number;
  averageRating: number;
  totalReviews: number;
}

const propertySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['house', 'apartment', 'condo'],
    required: true,
  },
  status: {
    type: String,
    enum: ['for-sale', 'for-rent'],
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [{
    type: String,
  }],
  details: {
    yearBuilt: Number,
    parking: Number,
    furnished: {
      type: Boolean,
      default: false,
    },
    petFriendly: {
      type: Boolean,
      default: false,
    },
    garden: {
      type: Boolean,
      default: false,
    },
    swimmingPool: {
      type: Boolean,
      default: false,
    },
    airConditioning: {
      type: Boolean,
      default: false,
    },
    heating: {
      type: Boolean,
      default: false,
    },
  },
  amenities: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Update property rating when a review is added or modified
propertySchema.statics.updatePropertyStats = async function(propertyId) {
  const stats = await this.model('Review').aggregate([
    { $match: { property: propertyId } },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  await this.findByIdAndUpdate(propertyId, {
    averageRating: stats[0]?.averageRating || 0,
    totalReviews: stats[0]?.totalReviews || 0
  });
};

export default mongoose.model<IProperty>('Property', propertySchema);