import { createReadStream, createWriteStream } from 'fs';
import path from 'path';

import { pathExists } from '../pathExists.js';

export const cp = async (currentDir, sourceFile, destinationPath) => {
  const filename = path.basename(sourceFile);
  const sourcePath = path.resolve(currentDir, sourceFile);
  const targetPath = path.resolve(currentDir, destinationPath ?? '', filename);

  try {
    if (!(await pathExists(sourcePath))) {
      throw new Error('File does not exist');
    }

    if (await pathExists(targetPath)) {
      throw new Error('File already exists');
    }

    const readable = createReadStream(sourcePath);
    const writable = createWriteStream(targetPath);

    return new Promise((resolve, reject) => {
      readable.on('error', (error) => reject(error));
      writable.on('error', (error) => reject(error));
      writable.on('finish', () => resolve());

      readable.pipe(writable);
    });
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
};
