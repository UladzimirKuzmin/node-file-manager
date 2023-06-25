import { promises as fsPromises } from 'fs';
import path from 'path';

import { pathExists } from '../pathExists.js';

export const rm = async (currentDir, sourceFile) => {
  const fileToRemove = path.resolve(currentDir, sourceFile);

  try {
    if (await pathExists(fileToRemove)) {
      await fsPromises.unlink(fileToRemove);
      console.log('File removed successfully!');
    } else {
      throw new Error('File to remove does not exist or inaccessible');
    }
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
};
