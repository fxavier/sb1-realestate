import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  name: string;
  price: number;
  duration: number; // in days
  maxProperties: number;
  features: string[];
  isActive: boolean;
}

const subscriptionPlanSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  maxProperties: {
    type: Number,
    required: true,
  },
  features: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model<ISubscriptionPlan>('SubscriptionPlan', subscriptionPlanSchema);