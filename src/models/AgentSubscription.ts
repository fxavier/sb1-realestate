import mongoose, { Document, Schema } from 'mongoose';

export interface IAgentSubscription extends Document {
  agent: mongoose.Types.ObjectId;
  plan: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  propertiesPosted: number;
}

const agentSubscriptionSchema = new Schema({
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  propertiesPosted: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model<IAgentSubscription>('AgentSubscription', agentSubscriptionSchema);