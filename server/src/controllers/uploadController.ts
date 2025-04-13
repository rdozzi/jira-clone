import { Request, Response } from 'express';
import { handleFileUpload } from '../services/uploadService';

export async function handleUpload(req: Request, res: Response) {
  try {
    const metadata = await handleFileUpload(req.file as Express.Multer.File);
    res.status(200).json({
      message: 'File uploaded successfully',
      metadata,
    });
  } catch (error) {
    res.status(500).json({
      message: 'File upload failed',
      error: (error as Error).message,
    });
  }
}
