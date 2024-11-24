import { Request, Response } from 'express';
import Property from '../models/Property';
import Location from '../models/Location';
import AgentSubscription from '../models/AgentSubscription';
import { ImageService } from '../services/imageService';

const imageService = new ImageService();

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    // Check subscription and property limit
    const subscription = await AgentSubscription.findOne({
      agent: userId,
      isActive: true,
    }).populate('plan');

    if (!subscription) {
      res.status(403).json({ message: 'Active subscription required to post properties' });
      return;
    }

    if (subscription.propertiesPosted >= subscription.plan.maxProperties) {
      res.status(403).json({ message: 'Property limit reached for current subscription' });
      return;
    }

    // Handle image uploads
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map(file => imageService.uploadImage(file));
      const imageKeys = await Promise.all(uploadPromises);
      imageUrls.push(...imageKeys.map(key => `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`));
    }

    // Create location
    const location = await Location.create(req.body.location);

    // Create property with images
    const property = await Property.create({
      ...req.body,
      location: location._id,
      owner: userId,
      images: imageUrls,
    });

    // Update subscription properties count
    subscription.propertiesPosted += 1;
    await subscription.save();

    await property.populate([
      { path: 'location' },
      { path: 'owner', select: 'name email' }
    ]);

    res.status(201).json(property);
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ message: 'Failed to create property' });
  }
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const property = await Property.findOne({ _id: id, owner: userId });
    if (!property) {
      res.status(404).json({ message: 'Property not found or not authorized' });
      return;
    }

    // Handle new image uploads
    const files = req.files as Express.Multer.File[];
    const newImageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map(file => imageService.uploadImage(file));
      const imageKeys = await Promise.all(uploadPromises);
      newImageUrls.push(...imageKeys.map(key => `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`));
    }

    // Update location if provided
    let locationId = property.location;
    if (req.body.location) {
      const location = await Location.findByIdAndUpdate(
        property.location,
        req.body.location,
        { new: true }
      );
      locationId = location._id;
    }

    // Combine existing and new images
    const updatedImages = [...(property.images || []), ...newImageUrls];

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        ...req.body,
        location: locationId,
        images: updatedImages,
      },
      { new: true }
    ).populate([
      { path: 'location' },
      { path: 'owner', select: 'name email' }
    ]);

    res.json(updatedProperty);
  } catch (error) {
    console.error('Property update error:', error);
    res.status(500).json({ message: 'Failed to update property' });
  }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const property = await Property.findOne({ _id: id, owner: userId });
    if (!property) {
      res.status(404).json({ message: 'Property not found or not authorized' });
      return;
    }

    // Delete associated images from S3
    if (property.images && property.images.length > 0) {
      const deletePromises = property.images.map(imageUrl => {
        const key = imageUrl.split('/').pop();
        if (key) return imageService.deleteImage(key);
      });
      await Promise.all(deletePromises);
    }

    // Delete the property and its location
    await Location.findByIdAndDelete(property.location);
    await property.deleteOne();

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Property deletion error:', error);
    res.status(500).json({ message: 'Failed to delete property' });
  }
};