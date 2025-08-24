import { readdir } from 'fs/promises';
import { unlink } from 'fs/promises';
import path from 'path';

export async function deleteUploads() {
  // Get the filepath to uploads folder
  // Read the contents of the uploads folder
  // Use a for loop to delete the contents of the folder

  const uploadPath = path.join(process.cwd(), 'uploads');

  const files = await readdir(uploadPath);

  await Promise.all(
    files.map((file) => {
      const filepath = path.join(uploadPath, file);
      unlink(filepath);
    })
  );

  return uploadPath;
}
