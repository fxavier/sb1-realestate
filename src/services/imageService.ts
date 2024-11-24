import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config/s3Config';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export class ImageService {
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      // Process image with sharp
      const processedImage = await sharp(file.buffer)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      const key = `properties/${uuidv4()}.jpg`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: processedImage,
        ContentType: 'image/jpeg',
      });

      await s3Client.send(command);
      return key;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteImage(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: `properties/${key}`,
        ContentType: 'image/jpeg',
      });

      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }
}