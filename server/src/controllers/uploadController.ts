import { Request, Response } from 'express';
import { storageDispatcher } from '../utilities/storageDispatcher';

export async function handleUpload(req: Request, res: Response) {
  try {
    if (!req.file) throw new Error('No file uploaded');
    const destination = req.query.destination || 'LOCAL'; // Default to LOCAL if not specified
    const metadata = await storageDispatcher(req.file, destination);
    res.status(200).json({
      message: 'File uploaded successfully',
      metadata,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message,
    });
  }
}
