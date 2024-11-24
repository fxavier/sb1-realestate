import { Request, Response } from 'express';
import SubscriptionPlan from '../models/SubscriptionPlan';
import AgentSubscription from '../models/AgentSubscription';

export const createSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubscriptionPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const subscribeAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = req.body;
    
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      res.status(404).json({ message: 'Subscription plan not found' });
      return;
    }

    // Calculate end date based on plan duration
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await AgentSubscription.create({
      agent: req.user?._id,
      plan: planId,
      endDate,
    });

    await subscription.populate('plan');
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAgentSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscription = await AgentSubscription.findOne({
      agent: req.user?._id,
      isActive: true,
    }).populate('plan');

    if (!subscription) {
      res.status(404).json({ message: 'No active subscription found' });
      return;
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};