import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import axios from 'axios';
import { generateSignedCloudUrl } from '../utilities/generateSignedCloudUrl';
import { PrismaClient } from '@prisma/client';

export async function downloadMultipleAttachments(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No attachment Ids provided.' });

    const attachments = await prisma.attachment.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (attachments.length === 0) {
      return res.status(404).json({ error: 'No attachments found.' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=attachments-${Date.now()}.zip`
    );
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    archive.pipe(res);

    for (const attachment of attachments) {
      const { filePath, fileUrl, fileName, storageType } = attachment;

      if (storageType === 'LOCAL') {
        const fullpath = path.resolve(filePath || '');
        if (fs.existsSync(fullpath)) {
          archive.file(fullpath, { name: fileName });
        } else {
          console.warn('Local file not found: ${fullpath}');
        }
      } else if (storageType === 'CLOUD') {
        try {
          const signedUrl = await generateSignedCloudUrl({
            fileUrl: fileUrl || '',
          });
          const response = await axios.get(signedUrl, {
            responseType: 'stream',
          });
          archive.append(response.data, { name: fileName });
        } catch (error) {
          console.error('Error downloading file from cloud: ', error);
          return res.status(500).json({ error: 'Failed to download file' });
        }
      }
    }
    archive.finalize();
  }
}
