import express from 'express';
import {
  createSubscriptionPlan,
  getSubscriptionPlans,
  subscribeAgent,
  getAgentSubscription,
} from '../controllers/subscriptionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/plans')
  .get(getSubscriptionPlans)
  .post(protect, authorize('admin'), createSubscriptionPlan);

router.route('/subscribe')
  .post(protect, authorize('agent'), subscribeAgent);

router.route('/my-subscription')
  .get(protect, authorize('agent'), getAgentSubscription);

export default router;