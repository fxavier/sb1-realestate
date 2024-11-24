import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  country: string;
  province: string;
  city: string;
  village?: string;
  avenue?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const locationSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  village: String,
  avenue: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
});

export default mongoose.model<ILocation>('Location', locationSchema);