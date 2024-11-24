import { Request, Response } from 'express';
import { ImageService } from '../services/imageService';

const imageService = new ImageService();

export const uploadPropertyImages = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({ message: 'No images uploaded' });
      return;
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(file => 
      imageService.uploadImage(file)
    );

    const imageKeys = await Promise.all(uploadPromises);
    
    res.status(201).json({ 
      message: 'Images uploaded successfully',
      imageKeys 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
};

export const deletePropertyImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    await imageService.deleteImage(key);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image' });
  }
};

export const getUploadUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const signedUrl = await imageService.getSignedUrl(filename);
    res.json({ signedUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate upload URL' });
  }
};